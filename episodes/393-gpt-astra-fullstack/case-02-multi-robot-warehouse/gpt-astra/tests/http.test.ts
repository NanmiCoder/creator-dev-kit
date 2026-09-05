import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { StreamEnvelope } from '../shared/types';

test('HTTP: create 3 jobs, fresh SSE reconnect, increasing events, and server restart', { timeout: 20000 }, async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'relay-http-'));
  let child: ChildProcess | undefined;
  async function start() {
    child = spawn(process.execPath, ['--import', 'tsx', 'server/index.ts'], {
      cwd: process.cwd(), env: { ...process.env, PORT: '0', NODE_ENV: 'production', DATA_FILE: path.join(dir, 'state.json') }, stdio: ['ignore', 'pipe', 'pipe'],
    });
    const processRef = child;
    return new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Test server failed to start')), 10000);
      processRef.stdout!.on('data', data => {
        const match = String(data).match(/http:\/\/localhost:(\d+)/);
        if (match) { clearTimeout(timer); resolve(match[0]); }
      });
      processRef.once('error', err => { clearTimeout(timer); reject(err); });
      processRef.once('exit', code => { if (code) { clearTimeout(timer); reject(new Error(`Server exited ${code}`)); } });
    });
  }
  async function stop() {
    if (!child || child.exitCode !== null) return;
    const c = child; await new Promise<void>(resolve => { c.once('exit', () => resolve()); c.kill('SIGTERM'); });
  }
  async function stream(url: string, lastEventId = '0') {
    const controller = new AbortController();
    const response = await fetch(`${url}/api/events`, { signal: controller.signal, headers: { 'Last-Event-ID': lastEventId } });
    assert.equal(response.status, 200);
    const reader = response.body!.getReader(); const decoder = new TextDecoder(); let buffer = '';
    async function next(): Promise<StreamEnvelope> {
      while (true) {
        const boundary = buffer.indexOf('\n\n');
        if (boundary >= 0) {
          const block = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 2);
          const data = block.split('\n').find(line => line.startsWith('data: '));
          if (data) return JSON.parse(data.slice(6));
          continue;
        }
        const chunk = await reader.read(); if (chunk.done) throw new Error('SSE ended unexpectedly');
        buffer += decoder.decode(chunk.value, { stream: true });
      }
    }
    return { next, close: () => controller.abort() };
  }
  try {
    let url = await start();
    const first = await stream(url); const initial = await first.next();
    assert.equal(initial.type, 'snapshot'); assert.equal(initial.seq, initial.state.seq);
    first.close();
    for (const shelfId of ['S04', 'S48', 'S73']) {
      const response = await fetch(`${url}/api/jobs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shelfId, stationId: 'WS-02', priority: 'high' }) });
      assert.equal(response.status, 201);
    }
    const reconnect = await stream(url, String(initial.seq)); const snapshot = await reconnect.next();
    assert.equal(snapshot.type, 'snapshot'); assert.ok(snapshot.seq > initial.seq); assert.equal(snapshot.state.jobs.length, 7);
    await fetch(`${url}/api/control`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'step' }) });
    const subsequent = await reconnect.next(); assert.equal(subsequent.type, 'state'); assert.ok(subsequent.seq > snapshot.seq);
    assert.equal(subsequent.state.tick, snapshot.state.tick + 1); reconnect.close();
    // Repeated clicks toggle the authoritative latest cell state, without
    // requiring the client to wait for an SSE snapshot between edits.
    const toggleCell = async (x: number, y: number) => fetch(`${url}/api/obstacles/toggle`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ x, y }),
    });
    const blocked = await toggleCell(7, 5).then(r => r.json());
    assert.equal(blocked.blocked, true);
    const blockedState = await fetch(`${url}/api/state`).then(r => r.json());
    assert.ok(blockedState.robots.every((r: { route: { x: number; y: number }[] }) => r.route.every(p => p.x !== 7 || p.y !== 5)));
    const reopened = await toggleCell(7, 5).then(r => r.json());
    assert.equal(reopened.blocked, false); assert.ok(reopened.seq > blocked.seq);
    await Promise.all(Array.from({ length: 6 }, () => toggleCell(7, 5)));
    const afterRapidClicks = await fetch(`${url}/api/state`).then(r => r.json());
    assert.ok(!afterRapidClicks.blocked.some((c: { x: number; y: number }) => c.x === 7 && c.y === 5));
    assert.equal(afterRapidClicks.seq, reopened.seq + 6);
    const shelfClick = await toggleCell(5, 4); assert.equal(shelfClick.status, 400);
    assert.equal((await fetch(`${url}/api/state`).then(r => r.json())).seq, afterRapidClicks.seq);
    const before = await fetch(`${url}/api/state`).then(r => r.json());
    await stop(); url = await start();
    const restored = await fetch(`${url}/api/state`).then(r => r.json()); assert.deepEqual(restored, before);
    const resetResponse = await fetch(`${url}/api/control`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reset' }) });
    assert.equal(resetResponse.status, 200);
    const finalStream = await stream(url, String(before.seq)); const reset = await finalStream.next(); finalStream.close();
    assert.equal(reset.state.tick, 0); assert.ok(reset.seq > before.seq);
  } finally { await stop(); rmSync(dir, { recursive: true, force: true }); }
});

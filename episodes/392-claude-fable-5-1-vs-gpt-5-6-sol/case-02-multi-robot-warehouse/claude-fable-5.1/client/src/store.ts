import { useSyncExternalStore } from 'react';
import type { ServerMessage, SimState, StatePatch } from '../../shared/types';

export type ConnStatus = 'connecting' | 'open' | 'closed' | 'offline';

export interface ClientView {
  state: SimState | null;
  conn: ConnStatus;
  lastSeq: number;
  snapshots: number;
  stale: number;
  gaps: number;
  eventsApplied: number;
}

function applyPatch(state: SimState, patch: StatePatch): SimState {
  const { logAppend, logReset, ...rest } = patch;
  let log = logReset ? [] : state.log;
  if (logAppend && logAppend.length) log = [...log, ...logAppend].slice(-300);
  return { ...state, ...rest, log };
}

/**
 * WebSocket client with reconnect. Every (re)connect requests a full snapshot;
 * events are applied only when seq === lastSeq + 1 (stale events are dropped,
 * gaps trigger a fresh snapshot). The server is the only source of truth.
 */
class Store {
  private view: ClientView = { state: null, conn: 'connecting', lastSeq: -1, snapshots: 0, stale: 0, gaps: 0, eventsApplied: 0 };
  private listeners = new Set<() => void>();
  private ws: WebSocket | null = null;
  private manualOffline = false;
  private retry: number | null = null;

  getSnapshot = (): ClientView => this.view;

  subscribe = (l: () => void): (() => void) => {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  };

  private set(partial: Partial<ClientView>): void {
    this.view = { ...this.view, ...partial };
    for (const l of this.listeners) l();
  }

  connect(): void {
    if (this.manualOffline) return;
    if (this.retry) {
      clearTimeout(this.retry);
      this.retry = null;
    }
    this.set({ conn: 'connecting' });
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${proto}://${location.host}/ws`);
    this.ws = ws;
    ws.onopen = () => {
      this.set({ conn: 'open' });
      ws.send(JSON.stringify({ type: 'hello', lastSeq: this.view.lastSeq }));
    };
    ws.onmessage = (ev) => this.handle(JSON.parse(ev.data) as ServerMessage);
    ws.onclose = () => {
      if (this.ws !== ws) return;
      this.ws = null;
      this.set({ conn: this.manualOffline ? 'offline' : 'closed' });
      if (!this.manualOffline) this.retry = window.setTimeout(() => this.connect(), 1500);
    };
    ws.onerror = () => ws.close();
  }

  setOffline(off: boolean): void {
    this.manualOffline = off;
    if (off) {
      const ws = this.ws;
      this.ws = null;
      ws?.close();
      if (this.retry) {
        clearTimeout(this.retry);
        this.retry = null;
      }
      this.set({ conn: 'offline' });
    } else {
      this.connect();
    }
  }

  private handle(msg: ServerMessage): void {
    if (msg.type === 'snapshot') {
      this.set({ state: msg.state, lastSeq: msg.seq, snapshots: this.view.snapshots + 1 });
      return;
    }
    const { lastSeq, state } = this.view;
    if (msg.seq <= lastSeq) {
      this.set({ stale: this.view.stale + 1 });
      return;
    }
    if (!state || msg.seq !== lastSeq + 1) {
      this.set({ gaps: this.view.gaps + 1 });
      this.ws?.send(JSON.stringify({ type: 'hello', lastSeq }));
      return;
    }
    this.set({ state: applyPatch(state, msg.patch), lastSeq: msg.seq, eventsApplied: this.view.eventsApplied + 1 });
  }
}

export const store = new Store();

export function useSim(): ClientView {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}

export async function api(path: string, body?: unknown, method = 'POST'): Promise<unknown> {
  const r = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const j = (await r.json()) as { ok: boolean; result?: unknown; error?: string };
  if (!j.ok) throw new Error(j.error ?? '请求失败');
  return j.result;
}

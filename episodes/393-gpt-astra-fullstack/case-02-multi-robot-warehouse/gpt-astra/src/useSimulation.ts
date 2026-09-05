import { useCallback, useEffect, useRef, useState } from 'react';
import type { SimulationState, StreamEnvelope } from '../shared/types';
import { translateMessage } from './locale';

export function acceptEnvelope(currentSeq: number, data: StreamEnvelope) {
  return Number.isSafeInteger(data.seq) && data.seq === data.state.seq && data.seq > currentSeq;
}
export function useSimulation() {
  const [state, setState] = useState<SimulationState | null>(null);
  const [connection, setConnection] = useState<'connecting' | 'live' | 'reconnecting'>('connecting');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const sequence = useRef(-1);
  const requests = useRef(0);
  useEffect(() => {
    let stream: EventSource | null = null;
    const receive = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as StreamEnvelope;
        if (acceptEnvelope(sequence.current, data)) {
          sequence.current = data.seq; setState(data.state);
        }
        if (data.type === 'snapshot' && data.seq >= sequence.current) setConnection('live');
      } catch { setError('无法读取状态更新，请重新连接以获取最新数据。'); }
    };
    const connect = () => {
      stream?.close();
      stream = new EventSource('/api/events');
      stream.addEventListener('snapshot', receive as EventListener);
      stream.addEventListener('state', receive as EventListener);
      stream.onerror = () => setConnection('reconnecting');
    };
    const disconnect = () => { stream?.close(); stream = null; setConnection('reconnecting'); };
    window.addEventListener('offline', disconnect);
    window.addEventListener('online', connect);
    if (navigator.onLine) connect(); else disconnect();
    return () => {
      stream?.close();
      window.removeEventListener('offline', disconnect);
      window.removeEventListener('online', connect);
    };
  }, []);
  const command = useCallback(async (url: string, body?: unknown, method = 'POST') => {
    requests.current++; setPending(true); setError('');
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? '操作失败，请稍后重试。');
      return result;
    } catch (err) { const error = new Error(translateMessage((err as Error).message)); setError(error.message); throw error; }
    finally { requests.current--; setPending(requests.current > 0); }
  }, []);
  return { state, connection, error, setError, pending, command };
}

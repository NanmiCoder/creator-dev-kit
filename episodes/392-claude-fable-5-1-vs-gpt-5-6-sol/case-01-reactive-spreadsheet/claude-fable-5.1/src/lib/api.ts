export interface PersistedCell {
  raw: string;
  value: number | string | boolean | null;
  display: string;
  error?: string;
}

export interface PersistedWorkbook {
  version: number;
  updatedAt: string | null;
  cells: Record<string, PersistedCell>;
}

const BASE = '/api/workbook';

export async function fetchWorkbook(): Promise<PersistedWorkbook> {
  const res = await fetch(BASE, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`GET ${BASE} failed with ${res.status}`);
  return (await res.json()) as PersistedWorkbook;
}

export async function saveWorkbook(cells: Record<string, PersistedCell>): Promise<{ updatedAt: string }> {
  const res = await fetch(BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cells }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `PUT ${BASE} failed with ${res.status}`);
  }
  return (await res.json()) as { updatedAt: string };
}

/** Best-effort save while the page is unloading (does not wait for a response). */
export function beaconSaveWorkbook(cells: Record<string, PersistedCell>): boolean {
  if (typeof navigator === 'undefined' || !navigator.sendBeacon) return false;
  const blob = new Blob([JSON.stringify({ cells })], { type: 'application/json' });
  return navigator.sendBeacon(BASE, blob);
}

export async function resetWorkbook(): Promise<void> {
  const res = await fetch(BASE, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE ${BASE} failed with ${res.status}`);
}

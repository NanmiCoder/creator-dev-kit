import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_GRID, Workbook, isError, type CellInput, type CellSnapshot, type GridSize } from '../engine';
import { beaconSaveWorkbook, fetchWorkbook, saveWorkbook, type PersistedCell } from '../lib/api';
import { History } from '../lib/history';

export type LoadStatus = 'loading' | 'ready' | 'offline';
export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

interface HistoryState {
  canUndo: boolean;
  canRedo: boolean;
  undoLabel: string | null;
  redoLabel: string | null;
  undoDepth: number;
  redoDepth: number;
}

const SAVE_DEBOUNCE_MS = 400;
const UNDO_LIMIT = 200;

const EMPTY_SNAPSHOT = (addr: string): CellSnapshot => ({
  addr,
  raw: '',
  value: null,
  display: '',
  isFormula: false,
  error: null,
  errorMessage: '',
  precedents: [],
  dependents: [],
});

function toPersisted(snapshot: CellSnapshot): PersistedCell {
  const v = snapshot.value;
  return {
    raw: snapshot.raw,
    value: isError(v) ? null : v,
    display: snapshot.display,
    ...(snapshot.error ? { error: snapshot.error } : {}),
  };
}

/** Bridges the mutable engine with React state, adds undo/redo and debounced autosave. */
export function useWorkbook(grid: GridSize = DEFAULT_GRID) {
  const wbRef = useRef<Workbook | null>(null);
  if (!wbRef.current) wbRef.current = new Workbook(grid);
  const wb = wbRef.current;
  const historyRef = useRef(new History(UNDO_LIMIT));

  const [cells, setCells] = useState<Record<string, CellSnapshot>>({});
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryState>({
    canUndo: false,
    canRedo: false,
    undoLabel: null,
    redoLabel: null,
    undoDepth: 0,
    redoDepth: 0,
  });

  const dirtyRef = useRef(false);
  const saveTimer = useRef<number | null>(null);
  const loadStatusRef = useRef<LoadStatus>('loading');

  const syncHistory = useCallback(() => {
    const h = historyRef.current;
    setHistory({
      canUndo: h.canUndo,
      canRedo: h.canRedo,
      undoLabel: h.undoLabel,
      redoLabel: h.redoLabel,
      undoDepth: h.undoDepth,
      redoDepth: h.redoDepth,
    });
  }, []);

  const applyChanged = useCallback(
    (changed: string[]) => {
      setCells((prev) => {
        const next = { ...prev };
        for (const addr of changed) {
          const snap = wb.getSnapshot(addr);
          if (snap.raw === '' && snap.dependents.length === 0) delete next[addr];
          else next[addr] = snap;
        }
        return next;
      });
    },
    [wb],
  );

  const buildPayload = useCallback((): Record<string, PersistedCell> => {
    const out: Record<string, PersistedCell> = {};
    for (const addr of Object.keys(wb.toJSON())) out[addr] = toPersisted(wb.getSnapshot(addr));
    return out;
  }, [wb]);

  const flushSave = useCallback(async () => {
    if (saveTimer.current !== null) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    setSaveStatus('saving');
    try {
      const { updatedAt } = await saveWorkbook(buildPayload());
      setLastSavedAt(updatedAt);
      setSaveError(null);
      setSaveStatus(dirtyRef.current ? 'dirty' : 'saved');
    } catch (e) {
      dirtyRef.current = true;
      setSaveError(e instanceof Error ? e.message : String(e));
      setSaveStatus('error');
    }
  }, [buildPayload]);

  const scheduleSave = useCallback(() => {
    dirtyRef.current = true;
    if (loadStatusRef.current === 'offline') return;
    setSaveStatus('dirty');
    if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => void flushSave(), SAVE_DEBOUNCE_MS);
  }, [flushSave]);

  /** Apply raw edits as one undoable step. Returns false when nothing changed. */
  const commit = useCallback(
    (inputs: CellInput[], label: string): boolean => {
      const changes = [];
      const seen = new Set<string>();
      for (const { addr, raw } of inputs) {
        if (seen.has(addr)) continue;
        seen.add(addr);
        const before = wb.getRaw(addr);
        if (before !== raw) changes.push({ addr, before, after: raw });
      }
      if (changes.length === 0) return false;
      const changed = wb.setCells(changes.map((c) => ({ addr: c.addr, raw: c.after })));
      historyRef.current.push({ label, changes });
      applyChanged(changed);
      syncHistory();
      scheduleSave();
      return true;
    },
    [wb, applyChanged, syncHistory, scheduleSave],
  );

  const undo = useCallback(() => {
    const entry = historyRef.current.undo();
    if (!entry) return;
    const changed = wb.setCells(entry.changes.map((c) => ({ addr: c.addr, raw: c.before })));
    applyChanged(changed);
    syncHistory();
    scheduleSave();
  }, [wb, applyChanged, syncHistory, scheduleSave]);

  const redo = useCallback(() => {
    const entry = historyRef.current.redo();
    if (!entry) return;
    const changed = wb.setCells(entry.changes.map((c) => ({ addr: c.addr, raw: c.after })));
    applyChanged(changed);
    syncHistory();
    scheduleSave();
  }, [wb, applyChanged, syncHistory, scheduleSave]);

  const clearAll = useCallback(() => {
    const inputs = Object.keys(wb.toJSON()).map((addr) => ({ addr, raw: '' }));
    commit(inputs, 'Clear sheet');
  }, [wb, commit]);

  const getCell = useCallback((addr: string): CellSnapshot => cells[addr] ?? EMPTY_SNAPSHOT(addr), [cells]);

  // Initial load from the backend.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchWorkbook();
        if (cancelled) return;
        const raw: Record<string, string> = {};
        for (const [addr, cell] of Object.entries(data.cells ?? {})) {
          if (cell && typeof cell.raw === 'string') raw[addr] = cell.raw;
        }
        wb.load(raw);
        historyRef.current.clear();
        setCells(wb.getAllSnapshots());
        setLastSavedAt(data.updatedAt ?? null);
        loadStatusRef.current = 'ready';
        setLoadStatus('ready');
        setSaveStatus('idle');
        syncHistory();
      } catch (e) {
        if (cancelled) return;
        console.error('Could not load workbook from the backend:', e);
        loadStatusRef.current = 'offline';
        setLoadStatus('offline');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [wb, syncHistory]);

  // Best-effort save when the tab is closed or reloaded while a debounced save is pending.
  useEffect(() => {
    const onHide = () => {
      if (!dirtyRef.current || loadStatusRef.current !== 'ready') return;
      if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
      if (beaconSaveWorkbook(buildPayload())) dirtyRef.current = false;
    };
    window.addEventListener('pagehide', onHide);
    window.addEventListener('beforeunload', onHide);
    return () => {
      window.removeEventListener('pagehide', onHide);
      window.removeEventListener('beforeunload', onHide);
    };
  }, [buildPayload]);

  const transitive = useMemo(
    () => ({
      dependents: (addr: string) => wb.getTransitiveDependents(addr),
      precedents: (addr: string) => wb.getTransitivePrecedents(addr),
    }),
    [wb],
  );

  return {
    grid: wb.grid,
    cells,
    getCell,
    commit,
    undo,
    redo,
    clearAll,
    flushSave,
    history,
    loadStatus,
    saveStatus,
    saveError,
    lastSavedAt,
    transitive,
  };
}

export type WorkbookApi = ReturnType<typeof useWorkbook>;

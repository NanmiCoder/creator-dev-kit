import type { LoadStatus, SaveStatus } from '../hooks/useWorkbook';

export interface ToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  undoLabel: string | null;
  redoLabel: string | null;
  undoDepth: number;
  redoDepth: number;
  loadStatus: LoadStatus;
  saveStatus: SaveStatus;
  saveError: string | null;
  lastSavedAt: string | null;
  onUndo: () => void;
  onRedo: () => void;
  onLoadDemo: () => void;
  onClearAll: () => void;
}

function saveText(p: ToolbarProps): { text: string; tone: string } {
  if (p.loadStatus === 'loading') return { text: 'Loading workbook…', tone: 'muted' };
  if (p.loadStatus === 'offline') return { text: 'Backend unreachable — changes will not be saved', tone: 'error' };
  switch (p.saveStatus) {
    case 'dirty': return { text: 'Unsaved changes…', tone: 'muted' };
    case 'saving': return { text: 'Saving…', tone: 'muted' };
    case 'error': return { text: `Save failed: ${p.saveError ?? 'unknown error'}`, tone: 'error' };
    case 'saved': return { text: `Saved ${p.lastSavedAt ? new Date(p.lastSavedAt).toLocaleTimeString() : ''}`, tone: 'ok' };
    default: return { text: p.lastSavedAt ? `Loaded (last saved ${new Date(p.lastSavedAt).toLocaleTimeString()})` : 'Empty workbook', tone: 'muted' };
  }
}

export function Toolbar(p: ToolbarProps) {
  const status = saveText(p);
  return (
    <header className="toolbar">
      <div className="toolbar__brand">
        <span className="toolbar__logo">Σ</span>
        <div>
          <h1 className="toolbar__title">Reactive Spreadsheet</h1>
          <p className="toolbar__subtitle">Formula engine · dependency graph · undo/redo · persisted</p>
        </div>
      </div>
      <div className="toolbar__actions">
        <button type="button" className="btn" onClick={p.onUndo} disabled={!p.canUndo} title={p.undoLabel ? `Undo: ${p.undoLabel} (Ctrl/Cmd+Z)` : 'Nothing to undo'}>
          ↶ Undo{p.undoDepth ? <span className="btn__count">{p.undoDepth}</span> : null}
        </button>
        <button type="button" className="btn" onClick={p.onRedo} disabled={!p.canRedo} title={p.redoLabel ? `Redo: ${p.redoLabel} (Ctrl/Cmd+Shift+Z)` : 'Nothing to redo'}>
          ↷ Redo{p.redoDepth ? <span className="btn__count">{p.redoDepth}</span> : null}
        </button>
        <span className="toolbar__sep" />
        <button type="button" className="btn" onClick={p.onLoadDemo} title="Fill the sheet with an example (undoable)">Load example</button>
        <button type="button" className="btn btn--danger" onClick={p.onClearAll} title="Clear every cell (undoable)">Clear sheet</button>
      </div>
      <div className={`toolbar__status toolbar__status--${status.tone}`} role="status" aria-live="polite">
        <span className="toolbar__dot" />
        {status.text}
      </div>
    </header>
  );
}

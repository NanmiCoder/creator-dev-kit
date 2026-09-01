import {
  type ClipboardEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  COLUMN_COUNT,
  ROW_COUNT,
  SpreadsheetEngine,
  cellId,
  columnLabel,
  parseCellId,
  type WorkbookSnapshot,
} from './formulaEngine';

type Edit = { id: string; before: string; after: string };
type SaveStatus = 'loading' | 'saved' | 'saving' | 'dirty' | 'offline';
type ActiveEditor = { id: string; draft: string; replace?: boolean } | null;

const SAVE_LABELS: Record<SaveStatus, string> = {
  loading: 'Opening workbook',
  saved: 'All changes saved',
  saving: 'Saving…',
  dirty: 'Unsaved changes',
  offline: 'Local mode',
};

function Icon({ name }: { name: 'undo' | 'redo' | 'formula' | 'link' | 'arrow' | 'check' }) {
  const paths = {
    undo: <path d="M9.5 7H5V2.5M5.3 7A6 6 0 1 1 5 14" />,
    redo: <path d="M10.5 7H15V2.5M14.7 7A6 6 0 1 0 15 14" />,
    formula: <path d="M5 4h9M10 4 7 16M4 11h7" />,
    link: <><path d="M7.5 12.5 12.5 7.5" /><path d="M6.5 15.5h-1a3 3 0 0 1 0-6h3M13.5 4.5h1a3 3 0 0 1 0 6h-3" /></>,
    arrow: <path d="M3 10h13m-4-4 4 4-4 4" />,
    check: <path d="m4 10 4 4 8-9" />,
  };
  return <svg aria-hidden="true" viewBox="0 0 20 20">{paths[name]}</svg>;
}

function MoveKeyHint() {
  return (
    <span className="key-hint" aria-label="Use arrow keys to move">
      <kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd>
    </span>
  );
}

export default function App() {
  const engineRef = useRef(new SpreadsheetEngine());
  const gridRef = useRef<HTMLDivElement>(null);
  const lastSavedRevision = useRef(0);
  const [workbook, setWorkbook] = useState<WorkbookSnapshot>(() => engineRef.current.snapshot());
  const [selected, setSelected] = useState('A1');
  const [editor, setEditor] = useState<ActiveEditor>(null);
  const [formulaDraft, setFormulaDraft] = useState('');
  const [history, setHistory] = useState<Edit[]>([]);
  const [future, setFuture] = useState<Edit[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('loading');

  const selectedCell = workbook.cells[selected];
  const upstream = useMemo(
    () => engineRef.current.getAncestors(selected),
    [selected, workbook.revision],
  );
  const downstream = useMemo(
    () => engineRef.current.getDescendants(selected),
    [selected, workbook.revision],
  );

  const stats = useMemo(() => {
    const cells = Object.values(workbook.cells);
    return {
      populated: cells.filter((cell) => cell.raw !== '').length,
      formulas: cells.filter((cell) => cell.raw.startsWith('=')).length,
      errors: cells.filter((cell) => cell.error).length,
    };
  }, [workbook]);

  useEffect(() => {
    let active = true;
    fetch('/api/workbook')
      .then(async (response) => {
        if (!response.ok) throw new Error('Workbook unavailable');
        return response.json() as Promise<{ cells?: Record<string, string> }>;
      })
      .then((payload) => {
        if (!active) return;
        engineRef.current = new SpreadsheetEngine(payload.cells ?? {});
        const snapshot = engineRef.current.snapshot();
        lastSavedRevision.current = snapshot.revision;
        setWorkbook(snapshot);
        setSaveStatus('saved');
        setHydrated(true);
      })
      .catch(() => {
        if (!active) return;
        setSaveStatus('offline');
        setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || workbook.revision === lastSavedRevision.current || saveStatus === 'offline') return;
    const timer = window.setTimeout(async () => {
      setSaveStatus('saving');
      const computed = Object.fromEntries(
        Object.entries(workbook.cells)
          .filter(([, cell]) => cell.raw !== '')
          .map(([id, cell]) => [id, cell.display]),
      );
      try {
        const response = await fetch('/api/workbook', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cells: workbook.rawCells, computed }),
        });
        if (!response.ok) throw new Error('Save failed');
        lastSavedRevision.current = workbook.revision;
        setSaveStatus('saved');
      } catch {
        setSaveStatus('offline');
      }
    }, 420);
    return () => window.clearTimeout(timer);
  }, [hydrated, saveStatus, workbook]);

  useEffect(() => {
    setFormulaDraft(selectedCell?.raw ?? '');
  }, [selected, selectedCell?.raw]);

  useEffect(() => {
    if (editor) return;
    const target = gridRef.current?.querySelector<HTMLElement>(`[data-cell="${selected}"]`);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [selected, editor]);

  const writeCell = useCallback((id: string, raw: string, record = true) => {
    const before = engineRef.current.getRaw(id);
    if (before === raw) return;
    if (record) {
      setHistory((items) => [...items, { id, before, after: raw }].slice(-20));
      setFuture([]);
    }
    setWorkbook(engineRef.current.setCell(id, raw));
    setSaveStatus((status) => status === 'offline' ? status : 'dirty');
  }, []);

  const undo = useCallback(() => {
    const edit = history.at(-1);
    if (!edit) return;
    setHistory((items) => items.slice(0, -1));
    setFuture((items) => [...items, edit].slice(-20));
    setWorkbook(engineRef.current.setCell(edit.id, edit.before));
    setSelected(edit.id);
    setEditor(null);
    setSaveStatus((status) => status === 'offline' ? status : 'dirty');
  }, [history]);

  const redo = useCallback(() => {
    const edit = future.at(-1);
    if (!edit) return;
    setFuture((items) => items.slice(0, -1));
    setHistory((items) => [...items, edit].slice(-20));
    setWorkbook(engineRef.current.setCell(edit.id, edit.after));
    setSelected(edit.id);
    setEditor(null);
    setSaveStatus((status) => status === 'offline' ? status : 'dirty');
  }, [future]);

  useEffect(() => {
    const handleShortcut = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches('input, textarea, [contenteditable="true"]')) return;
      const command = event.metaKey || event.ctrlKey;
      if (!command || event.key.toLowerCase() !== 'z') {
        if (command && event.key.toLowerCase() === 'y') {
          event.preventDefault();
          redo();
        }
        return;
      }
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [redo, undo]);

  const moveSelection = (columnDelta: number, rowDelta: number) => {
    const position = parseCellId(selected)!;
    const column = Math.max(0, Math.min(COLUMN_COUNT - 1, position.column + columnDelta));
    const row = Math.max(0, Math.min(ROW_COUNT - 1, position.row + rowDelta));
    setSelected(cellId(column, row));
  };

  const beginEditing = (draft = selectedCell.raw, replace = false) => {
    setEditor({ id: selected, draft, replace });
  };

  const finishEditing = (moveDown = false) => {
    if (!editor) return;
    writeCell(editor.id, editor.draft);
    setEditor(null);
    if (moveDown) moveSelection(0, 1);
  };

  const handleCellKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (editor) return;
    if (event.key === 'ArrowUp') moveSelection(0, -1);
    else if (event.key === 'ArrowDown') moveSelection(0, 1);
    else if (event.key === 'ArrowLeft') moveSelection(-1, 0);
    else if (event.key === 'ArrowRight') moveSelection(1, 0);
    else if (event.key === 'Enter' || event.key === 'F2') beginEditing();
    else if (event.key === 'Backspace' || event.key === 'Delete') writeCell(selected, '');
    else if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      beginEditing(event.key, true);
    } else return;
    event.preventDefault();
  };

  const handleCopy = (event: ClipboardEvent<HTMLDivElement>) => {
    if (editor) return;
    event.preventDefault();
    event.clipboardData.setData('text/plain', selectedCell.raw);
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (editor) return;
    event.preventDefault();
    const start = parseCellId(selected)!;
    const rows = event.clipboardData.getData('text/plain').replace(/\r/g, '').split('\n');
    if (rows.at(-1) === '') rows.pop();
    rows.forEach((rowValue, rowOffset) => {
      rowValue.split('\t').forEach((raw, columnOffset) => {
        const column = start.column + columnOffset;
        const row = start.row + rowOffset;
        if (column < COLUMN_COUNT && row < ROW_COUNT) writeCell(cellId(column, row), raw);
      });
    });
  };

  const commitFormulaBar = () => writeCell(selected, formulaDraft);
  const directReferences = selectedCell?.dependencies ?? [];
  const directDependents = selectedCell?.dependents ?? [];
  const statusClass = saveStatus === 'offline' ? 'is-offline' : saveStatus === 'saved' ? 'is-saved' : '';

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true"><span>C</span><span>S</span></div>
          <div>
            <p className="eyebrow">Reactive workbook / 01</p>
            <h1>Chain Sheet</h1>
          </div>
        </div>
        <div className="header-meta">
          <div className="workbook-health" aria-label="Workbook summary">
            <span><b>{stats.populated}</b> used</span>
            <span><b>{stats.formulas}</b> formulas</span>
            <span className={stats.errors ? 'has-errors' : ''}><b>{stats.errors}</b> errors</span>
          </div>
          <div className={`save-status ${statusClass}`} role="status">
            <span className="status-light" />
            {SAVE_LABELS[saveStatus]}
          </div>
        </div>
      </header>

      <section className="workbench" aria-label="Spreadsheet workbench">
        <div className="sheet-panel">
          <div className="command-bar">
            <div className="history-controls" aria-label="Edit history">
              <button type="button" onClick={undo} disabled={!history.length} title="Undo (⌘Z)">
                <Icon name="undo" /><span>Undo</span>
              </button>
              <button type="button" onClick={redo} disabled={!future.length} title="Redo (⇧⌘Z)">
                <Icon name="redo" /><span>Redo</span>
              </button>
            </div>
            <div className="recalc-meter" title="Only cells affected by the last edit are recalculated">
              <span className="pulse-mark" />
              <strong>{workbook.recalculated.length}</strong>
              <span>recalculated</span>
            </div>
            <div className="nav-tip"><MoveKeyHint /><span>move</span><kbd>Enter</kbd><span>edit</span></div>
          </div>

          <div className="formula-bar">
            <label className="name-box" aria-label="Selected cell">{selected}</label>
            <span className="formula-icon"><Icon name="formula" /></span>
            <input
              aria-label={`Raw value for ${selected}`}
              value={formulaDraft}
              spellCheck={false}
              placeholder="Type a value or formula, e.g. =SUM(A1:A5)"
              onChange={(event) => setFormulaDraft(event.target.value)}
              onBlur={commitFormulaBar}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  commitFormulaBar();
                  gridRef.current?.querySelector<HTMLElement>(`[data-cell="${selected}"]`)?.focus();
                }
                if (event.key === 'Escape') setFormulaDraft(selectedCell.raw);
              }}
            />
            <span className={`result-peek ${selectedCell.error ? 'is-error' : ''}`} title="Computed result">
              {selectedCell.display || '—'}
            </span>
          </div>

          <div className="grid-wrap">
            <div
              className="spreadsheet-grid"
              ref={gridRef}
              role="grid"
              aria-label="20 row by 10 column spreadsheet"
              aria-rowcount={ROW_COUNT}
              aria-colcount={COLUMN_COUNT}
              onCopy={handleCopy}
              onPaste={handlePaste}
            >
              <div className="corner-cell" aria-hidden="true"><span /></div>
              {Array.from({ length: COLUMN_COUNT }, (_, column) => (
                <div className="column-header" role="columnheader" key={column}>{columnLabel(column)}</div>
              ))}
              {Array.from({ length: ROW_COUNT }, (_, row) => (
                <div className="grid-row" role="row" key={row}>
                  <div className="row-header" role="rowheader">{String(row + 1).padStart(2, '0')}</div>
                  {Array.from({ length: COLUMN_COUNT }, (_, column) => {
                    const id = cellId(column, row);
                    const cell = workbook.cells[id];
                    const isSelected = selected === id;
                    const isEditing = editor?.id === id;
                    const classes = [
                      'sheet-cell',
                      isSelected ? 'is-selected' : '',
                      upstream.has(id) ? 'is-reference' : '',
                      downstream.has(id) ? 'is-dependent' : '',
                      cell.error ? 'is-error' : '',
                      workbook.recalculated.includes(id) ? 'is-recalculated' : '',
                    ].filter(Boolean).join(' ');
                    return (
                      <div
                        className={classes}
                        data-cell={id}
                        role="gridcell"
                        aria-selected={isSelected}
                        aria-label={`${id}: ${cell.display || 'blank'}${cell.raw.startsWith('=') ? `, formula ${cell.raw}` : ''}`}
                        tabIndex={isSelected && !isEditing ? 0 : -1}
                        key={id}
                        onClick={() => { setSelected(id); setEditor(null); }}
                        onDoubleClick={() => { setSelected(id); setEditor({ id, draft: cell.raw }); }}
                        onKeyDown={handleCellKeyDown}
                      >
                        {isEditing ? (
                          <input
                            autoFocus
                            value={editor.draft}
                            aria-label={`Editing ${id}`}
                            spellCheck={false}
                            onFocus={(event) => editor.replace && event.currentTarget.setSelectionRange(1, 1)}
                            onChange={(event) => setEditor({ ...editor, draft: event.target.value, replace: false })}
                            onBlur={() => finishEditing()}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                event.preventDefault();
                                finishEditing(true);
                              } else if (event.key === 'Escape') {
                                event.preventDefault();
                                setEditor(null);
                              } else if (event.key === 'Tab') {
                                event.preventDefault();
                                finishEditing();
                                moveSelection(event.shiftKey ? -1 : 1, 0);
                              }
                            }}
                          />
                        ) : (
                          <span className={typeof cell.value === 'number' && !cell.error ? 'numeric' : ''}>
                            {cell.display}
                          </span>
                        )}
                        {isSelected && <i className="selection-handle" aria-hidden="true" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <footer className="sheet-tabs">
            <button className="add-sheet" type="button" disabled aria-label="Add sheet">+</button>
            <button className="active-tab" type="button"><span>Sheet 01</span><i /></button>
            <span className="grid-size">{COLUMN_COUNT} columns × {ROW_COUNT} rows</span>
          </footer>
        </div>

        <aside className="inspector" aria-label={`Dependency inspector for ${selected}`}>
          <div className="inspector-heading">
            <div>
              <p className="eyebrow">Dependency trace</p>
              <h2>{selected}</h2>
            </div>
            <span className={`type-chip ${selectedCell.error ? 'error-chip' : ''}`}>
              {selectedCell.error ? 'Error' : selectedCell.raw.startsWith('=') ? 'Formula' : selectedCell.raw === '' ? 'Empty' : typeof selectedCell.value === 'number' ? 'Number' : 'Text'}
            </span>
          </div>

          <div className={`computed-card ${selectedCell.error ? 'has-error' : ''}`}>
            <span>Computed value</span>
            <strong>{selectedCell.display || '—'}</strong>
            <code>{selectedCell.raw || 'No raw value'}</code>
          </div>

          <div className="dependency-rail" aria-label="Dependency flow">
            <DependencyNode
              label="Upstream"
              count={upstream.size}
              color="blue"
              detail={directReferences.length ? directReferences.join(', ') : 'No references'}
            />
            <span className="rail-arrow"><Icon name="arrow" /></span>
            <div className="selected-node"><span>{selected}</span><small>selected</small></div>
            <span className="rail-arrow"><Icon name="arrow" /></span>
            <DependencyNode
              label="Downstream"
              count={downstream.size}
              color="coral"
              detail={directDependents.length ? directDependents.join(', ') : 'No dependents'}
            />
          </div>

          <section className="relation-section">
            <div className="section-label">
              <span><i className="legend-dot blue" />References</span>
              <b>{upstream.size}</b>
            </div>
            <CellChips cells={[...upstream]} empty="This cell does not reference another cell." onSelect={setSelected} />
          </section>

          <section className="relation-section">
            <div className="section-label">
              <span><i className="legend-dot coral" />Dependents</span>
              <b>{downstream.size}</b>
            </div>
            <CellChips cells={[...downstream]} empty="No formulas currently depend on this cell." onSelect={setSelected} />
          </section>

          <div className="inspector-note">
            <Icon name="link" />
            <p><strong>Live graph.</strong> Blue cells feed this selection; coral cells receive its value. Relationships include every indirect hop.</p>
          </div>

          <div className="formula-reference">
            <p className="eyebrow">Formula field notes</p>
            <code>=A1 + B1 * 2</code>
            <code>=SUM(A1:A5) / 10</code>
            <code>=AVG(B1:B5) + C1</code>
          </div>
        </aside>
      </section>

      <footer className="app-footer">
        <span>CHAIN SHEET / Reactive computation surface</span>
        <span><Icon name="check" /> 20-step history · persistent workbook</span>
      </footer>
    </main>
  );
}

function DependencyNode({
  label,
  count,
  color,
  detail,
}: {
  label: string;
  count: number;
  color: 'blue' | 'coral';
  detail: string;
}) {
  return (
    <div className={`dependency-node ${color}`} title={detail}>
      <strong>{count}</strong>
      <span>{label}</span>
    </div>
  );
}

function CellChips({ cells, empty, onSelect }: { cells: string[]; empty: string; onSelect: (id: string) => void }) {
  if (!cells.length) return <p className="empty-relation">{empty}</p>;
  return (
    <div className="cell-chips">
      {cells.map((id) => (
        <button type="button" key={id} onClick={() => onSelect(id)}>{id}</button>
      ))}
    </div>
  );
}

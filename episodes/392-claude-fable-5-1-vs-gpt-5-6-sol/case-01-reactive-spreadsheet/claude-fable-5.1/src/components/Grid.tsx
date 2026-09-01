import { memo, useCallback, useEffect, useRef, type ClipboardEvent, type KeyboardEvent, type MouseEvent, type RefObject } from 'react';
import { columnLabel, formatAddress, parseAddress, type CellSnapshot, type GridSize } from '../engine';
import { bounds, type Selection } from '../lib/selection';

export interface EditingState {
  addr: string;
  value: string;
  source: 'cell' | 'bar';
}

export interface Highlights {
  precedents: Set<string>;
  dependents: Set<string>;
  indirectPrecedents: Set<string>;
  indirectDependents: Set<string>;
}

export interface GridProps {
  grid: GridSize;
  cells: Record<string, CellSnapshot>;
  selection: Selection;
  editing: EditingState | null;
  highlights: Highlights;
  containerRef: RefObject<HTMLDivElement>;
  onSelect: (sel: Selection) => void;
  onMove: (dc: number, dr: number, extend: boolean) => void;
  onStartEdit: (addr: string, initial?: string) => void;
  onEditChange: (value: string) => void;
  onCommitEdit: (move: 'down' | 'right' | 'none') => void;
  onCancelEdit: () => void;
  onClear: () => void;
  onSelectAll: () => void;
  onCopy: (e: ClipboardEvent, cut: boolean) => void;
  onPaste: (text: string) => void;
  onEscape: () => void;
}

interface CellViewProps {
  addr: string;
  snap: CellSnapshot | undefined;
  active: boolean;
  selected: boolean;
  precedent: boolean;
  dependent: boolean;
  indirectPrecedent: boolean;
  indirectDependent: boolean;
  editing: EditingState | null;
  onEditChange: (value: string) => void;
  onCommitEdit: (move: 'down' | 'right' | 'none') => void;
  onCancelEdit: () => void;
}

const CellView = memo(function CellView(p: CellViewProps) {
  const classes = ['cell'];
  if (p.active) classes.push('cell--active');
  if (p.selected) classes.push('cell--selected');
  if (p.precedent) classes.push('cell--precedent');
  else if (p.indirectPrecedent) classes.push('cell--precedent-indirect');
  if (p.dependent) classes.push('cell--dependent');
  else if (p.indirectDependent) classes.push('cell--dependent-indirect');
  if (p.snap?.error) classes.push('cell--error');
  else if (typeof p.snap?.value === 'number') classes.push('cell--number');
  else if (typeof p.snap?.value === 'boolean') classes.push('cell--boolean');
  if (p.snap?.isFormula) classes.push('cell--formula');

  const isEditingHere = p.editing !== null && p.editing.addr === p.addr;
  if (isEditingHere) classes.push('cell--editing');

  return (
    <td className={classes.join(' ')} data-addr={p.addr} title={p.snap?.raw || undefined}>
      {isEditingHere && p.editing!.source === 'cell' ? (
        <CellEditor value={p.editing!.value} onChange={p.onEditChange} onCommit={p.onCommitEdit} onCancel={p.onCancelEdit} />
      ) : (
        <span className="cell__text">{isEditingHere ? p.editing!.value : p.snap?.display ?? ''}</span>
      )}
    </td>
  );
});

function CellEditor(p: { value: string; onChange: (v: string) => void; onCommit: (m: 'down' | 'right' | 'none') => void; onCancel: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      p.onCommit(e.shiftKey ? 'none' : 'down');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      p.onCommit('right');
    } else if (e.key === 'Escape') {
      e.preventDefault();
      p.onCancel();
    }
  };
  return (
    <input
      ref={ref}
      className={`cell__input${p.value.startsWith('=') ? ' cell__input--formula' : ''}`}
      value={p.value}
      onChange={(e) => p.onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onBlur={() => p.onCommit('none')}
      spellCheck={false}
      autoComplete="off"
    />
  );
}

export function Grid(p: GridProps) {
  const { grid, cells, selection, editing, highlights, containerRef } = p;
  const b = bounds(selection);
  const activeAddr = formatAddress(selection.anchor);
  const dragging = useRef(false);

  // Keep the active cell in view when navigating with the keyboard.
  useEffect(() => {
    const el = containerRef.current?.querySelector<HTMLElement>(`td[data-addr="${activeAddr}"]`);
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [activeAddr, containerRef]);

  useEffect(() => {
    const up = () => {
      dragging.current = false;
    };
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, []);

  const cellFromEvent = (e: MouseEvent): { addr: string; col: number; row: number } | null => {
    const td = (e.target as HTMLElement).closest<HTMLElement>('td[data-addr]');
    if (!td) return null;
    const addr = td.dataset.addr!;
    const a = parseAddress(addr);
    return a ? { addr, col: a.col, row: a.row } : null;
  };

  const onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return;
    const c = cellFromEvent(e);
    if (!c) return;
    if (editing && editing.addr === c.addr && editing.source === 'cell') return; // clicking inside the editor
    if (editing) p.onCommitEdit('none');
    const target = { col: c.col, row: c.row };
    p.onSelect(e.shiftKey ? { anchor: selection.anchor, focus: target } : { anchor: target, focus: target });
    dragging.current = true;
    containerRef.current?.focus();
    e.preventDefault();
  };

  const onMouseOver = (e: MouseEvent) => {
    if (!dragging.current) return;
    const c = cellFromEvent(e);
    if (!c) return;
    const target = { col: c.col, row: c.row };
    if (target.col !== selection.focus.col || target.row !== selection.focus.row) {
      p.onSelect({ anchor: selection.anchor, focus: target });
    }
  };

  const onDoubleClick = (e: MouseEvent) => {
    const c = cellFromEvent(e);
    if (c) p.onStartEdit(c.addr);
  };

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (editing) return; // the editor handles its own keys
      const mod = e.metaKey || e.ctrlKey;
      const key = e.key;
      if (mod && (key === 'a' || key === 'A')) {
        e.preventDefault();
        p.onSelectAll();
        return;
      }
      if (mod) return; // let copy / cut / paste reach the clipboard events
      switch (key) {
        case 'ArrowUp': e.preventDefault(); p.onMove(0, -1, e.shiftKey); return;
        case 'ArrowDown': e.preventDefault(); p.onMove(0, 1, e.shiftKey); return;
        case 'ArrowLeft': e.preventDefault(); p.onMove(-1, 0, e.shiftKey); return;
        case 'ArrowRight': e.preventDefault(); p.onMove(1, 0, e.shiftKey); return;
        case 'Tab': e.preventDefault(); p.onMove(e.shiftKey ? -1 : 1, 0, false); return;
        case 'Home': e.preventDefault(); p.onMove(-grid.cols, 0, e.shiftKey); return;
        case 'End': e.preventDefault(); p.onMove(grid.cols, 0, e.shiftKey); return;
        case 'PageDown': e.preventDefault(); p.onMove(0, 10, e.shiftKey); return;
        case 'PageUp': e.preventDefault(); p.onMove(0, -10, e.shiftKey); return;
        case 'Enter':
          e.preventDefault();
          if (e.shiftKey) p.onMove(0, -1, false);
          else p.onStartEdit(activeAddr);
          return;
        case 'F2': e.preventDefault(); p.onStartEdit(activeAddr); return;
        case 'Delete':
        case 'Backspace': e.preventDefault(); p.onClear(); return;
        case 'Escape': e.preventDefault(); p.onEscape(); return;
        default:
          break;
      }
      if (key.length === 1 && !e.altKey) {
        e.preventDefault();
        p.onStartEdit(activeAddr, key);
      }
    },
    [editing, p, grid.cols, activeAddr],
  );

  const isFormField = (e: ClipboardEvent) => {
    const t = e.target as HTMLElement;
    return t.tagName === 'INPUT' || t.tagName === 'TEXTAREA';
  };
  const onCopy = (e: ClipboardEvent) => {
    if (isFormField(e)) return;
    p.onCopy(e, false);
  };
  const onCut = (e: ClipboardEvent) => {
    if (isFormField(e)) return;
    p.onCopy(e, true);
  };
  const onPaste = (e: ClipboardEvent) => {
    if (isFormField(e)) return;
    e.preventDefault();
    p.onPaste(e.clipboardData.getData('text/plain'));
  };

  const rows = [];
  for (let r = 0; r < grid.rows; r++) {
    const tds = [];
    for (let c = 0; c < grid.cols; c++) {
      const addr = formatAddress({ col: c, row: r });
      const selected = r >= b.r0 && r <= b.r1 && c >= b.c0 && c <= b.c1;
      tds.push(
        <CellView
          key={addr}
          addr={addr}
          snap={cells[addr]}
          active={addr === activeAddr}
          selected={selected}
          precedent={highlights.precedents.has(addr)}
          dependent={highlights.dependents.has(addr)}
          indirectPrecedent={highlights.indirectPrecedents.has(addr)}
          indirectDependent={highlights.indirectDependents.has(addr)}
          editing={editing && editing.addr === addr ? editing : null}
          onEditChange={p.onEditChange}
          onCommitEdit={p.onCommitEdit}
          onCancelEdit={p.onCancelEdit}
        />,
      );
    }
    const rowSelected = r >= b.r0 && r <= b.r1;
    rows.push(
      <tr key={r}>
        <th scope="row" className={`row-header${rowSelected ? ' header--selected' : ''}`}>{r + 1}</th>
        {tds}
      </tr>,
    );
  }

  const colHeaders = [];
  for (let c = 0; c < grid.cols; c++) {
    const colSelected = c >= b.c0 && c <= b.c1;
    colHeaders.push(
      <th key={c} scope="col" className={`col-header${colSelected ? ' header--selected' : ''}`}>{columnLabel(c)}</th>,
    );
  }

  return (
    <div
      ref={containerRef}
      className="grid"
      tabIndex={0}
      role="grid"
      aria-label="Spreadsheet"
      onKeyDown={onKeyDown}
      onCopy={onCopy}
      onCut={onCut}
      onPaste={onPaste}
    >
      <table className="sheet">
        <thead>
          <tr>
            <th className="corner" />
            {colHeaders}
          </tr>
        </thead>
        <tbody onMouseDown={onMouseDown} onMouseOver={onMouseOver} onDoubleClick={onDoubleClick}>
          {rows}
        </tbody>
      </table>
    </div>
  );
}

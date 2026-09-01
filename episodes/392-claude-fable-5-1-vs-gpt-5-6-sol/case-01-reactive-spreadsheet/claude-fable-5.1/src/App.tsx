import { useCallback, useEffect, useMemo, useRef, useState, type ClipboardEvent } from 'react';
import { formatAddress, inBounds, parseAddress, type Address } from './engine';
import { useWorkbook } from './hooks/useWorkbook';
import { Grid, type EditingState, type Highlights } from './components/Grid';
import { Toolbar } from './components/Toolbar';
import { FormulaBar } from './components/FormulaBar';
import { Inspector } from './components/Inspector';
import { addressesIn, bounds, describe, parseClipboardText, single, toClipboardText, type Selection } from './lib/selection';
import { DEMO_CELLS } from './lib/demo';

export default function App() {
  const wb = useWorkbook();
  const { grid } = wb;

  const [selection, setSelection] = useState<Selection>(single({ col: 0, row: 0 }));
  const [editing, setEditingState] = useState<EditingState | null>(null);
  const editingRef = useRef<EditingState | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const setEditing = useCallback((e: EditingState | null) => {
    editingRef.current = e;
    setEditingState(e);
  }, []);

  const clamp = useCallback(
    (a: Address): Address => ({
      col: Math.max(0, Math.min(grid.cols - 1, a.col)),
      row: Math.max(0, Math.min(grid.rows - 1, a.row)),
    }),
    [grid.cols, grid.rows],
  );

  const activeAddr = formatAddress(selection.anchor);
  const activeCell = wb.getCell(activeAddr);

  const focusGrid = useCallback(() => {
    // Focus synchronously so keystrokes typed right after a commit are not lost,
    // and once more after React has unmounted the editor input.
    gridRef.current?.focus();
    requestAnimationFrame(() => gridRef.current?.focus());
  }, []);

  // ----------------------------------------------------------------- selection

  const select = useCallback(
    (sel: Selection) => setSelection({ anchor: clamp(sel.anchor), focus: clamp(sel.focus) }),
    [clamp],
  );

  const move = useCallback(
    (dc: number, dr: number, extend: boolean) => {
      setSelection((prev) => {
        if (extend) return { anchor: prev.anchor, focus: clamp({ col: prev.focus.col + dc, row: prev.focus.row + dr }) };
        return single(clamp({ col: prev.anchor.col + dc, row: prev.anchor.row + dr }));
      });
    },
    [clamp],
  );

  const jumpTo = useCallback(
    (addr: string) => {
      const a = parseAddress(addr);
      if (!a || !inBounds(a, grid)) return;
      if (editingRef.current) {
        const e = editingRef.current;
        setEditing(null);
        wb.commit([{ addr: e.addr, raw: e.value }], `Edit ${e.addr}`);
      }
      setSelection(single(a));
      focusGrid();
    },
    [grid, wb, setEditing, focusGrid],
  );

  const selectAll = useCallback(() => {
    setSelection({ anchor: { col: 0, row: 0 }, focus: { col: grid.cols - 1, row: grid.rows - 1 } });
  }, [grid]);

  const collapseSelection = useCallback(() => setSelection((prev) => single(prev.anchor)), []);

  // ------------------------------------------------------------------- editing

  const startEdit = useCallback(
    (addr: string, initial?: string, source: 'cell' | 'bar' = 'cell') => {
      const a = parseAddress(addr);
      if (!a || !inBounds(a, grid)) return;
      setSelection(single(a));
      setEditing({ addr, value: initial ?? wb.getCell(addr).raw, source });
    },
    [grid, wb, setEditing],
  );

  const changeEdit = useCallback(
    (value: string) => {
      const e = editingRef.current;
      if (e) setEditing({ ...e, value });
    },
    [setEditing],
  );

  const commitEdit = useCallback(
    (moveDir: 'down' | 'right' | 'none') => {
      const e = editingRef.current;
      if (!e) return;
      setEditing(null);
      wb.commit([{ addr: e.addr, raw: e.value }], `Edit ${e.addr}`);
      if (moveDir === 'down') move(0, 1, false);
      else if (moveDir === 'right') move(1, 0, false);
      focusGrid();
    },
    [wb, move, setEditing, focusGrid],
  );

  const cancelEdit = useCallback(() => {
    setEditing(null);
    focusGrid();
  }, [setEditing, focusGrid]);

  const clearSelection = useCallback(() => {
    const addrs = addressesIn(selection);
    wb.commit(addrs.map((addr) => ({ addr, raw: '' })), addrs.length > 1 ? `Clear ${describe(selection)}` : `Clear ${addrs[0]}`);
  }, [selection, wb]);

  // ----------------------------------------------------------------- clipboard

  const copySelection = useCallback(
    (e: ClipboardEvent, cut: boolean) => {
      const b = bounds(selection);
      const rows: string[][] = [];
      for (let r = b.r0; r <= b.r1; r++) {
        const row: string[] = [];
        for (let c = b.c0; c <= b.c1; c++) row.push(wb.getCell(formatAddress({ col: c, row: r })).raw);
        rows.push(row);
      }
      e.clipboardData.setData('text/plain', toClipboardText(rows));
      e.preventDefault();
      if (cut) clearSelection();
    },
    [selection, wb, clearSelection],
  );

  const pasteText = useCallback(
    (text: string) => {
      if (!text) return;
      const block = parseClipboardText(text);
      const b = bounds(selection);
      const inputs: { addr: string; raw: string }[] = [];
      if (block.length === 1 && block[0].length === 1) {
        for (const addr of addressesIn(selection)) inputs.push({ addr, raw: block[0][0] });
        wb.commit(inputs, `Paste into ${describe(selection)}`);
        return;
      }
      let maxC = 0;
      block.forEach((row, r) => {
        row.forEach((raw, c) => {
          const target = { col: b.c0 + c, row: b.r0 + r };
          if (inBounds(target, grid)) inputs.push({ addr: formatAddress(target), raw });
          maxC = Math.max(maxC, c);
        });
      });
      wb.commit(inputs, 'Paste');
      setSelection({ anchor: { col: b.c0, row: b.r0 }, focus: clamp({ col: b.c0 + maxC, row: b.r0 + block.length - 1 }) });
    },
    [selection, wb, grid, clamp],
  );

  // ---------------------------------------------------------------- highlights

  const highlights = useMemo<Highlights>(() => {
    const precedents = new Set(activeCell.precedents);
    const dependents = new Set(activeCell.dependents);
    const indirectPrecedents = new Set(wb.transitive.precedents(activeAddr).filter((a) => !precedents.has(a)));
    const indirectDependents = new Set(wb.transitive.dependents(activeAddr).filter((a) => !dependents.has(a)));
    return { precedents, dependents, indirectPrecedents, indirectDependents };
    // wb.cells is listed so the transitive sets refresh after every recalculation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCell, activeAddr, wb.transitive, wb.cells]);

  const transitivePrecedents = useMemo(() => wb.transitive.precedents(activeAddr), [wb.transitive, activeAddr, wb.cells]); // eslint-disable-line react-hooks/exhaustive-deps
  const transitiveDependents = useMemo(() => wb.transitive.dependents(activeAddr), [wb.transitive, activeAddr, wb.cells]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDemo = useCallback(() => {
    wb.commit(DEMO_CELLS, 'Load example');
    setSelection(single({ col: 1, row: 11 }));
    focusGrid();
  }, [wb, focusGrid]);

  // Undo / redo work from anywhere on the page except inside a text field.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      const k = e.key.toLowerCase();
      if (k === 'z' || k === 'y') {
        e.preventDefault();
        if (editingRef.current) setEditing(null);
        if (k === 'y' || e.shiftKey) wb.redo();
        else wb.undo();
        focusGrid();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [wb, setEditing, focusGrid]);

  const barValue = editing ? editing.value : activeCell.raw;

  return (
    <div className="app">
      <Toolbar
        canUndo={wb.history.canUndo}
        canRedo={wb.history.canRedo}
        undoLabel={wb.history.undoLabel}
        redoLabel={wb.history.redoLabel}
        undoDepth={wb.history.undoDepth}
        redoDepth={wb.history.redoDepth}
        loadStatus={wb.loadStatus}
        saveStatus={wb.saveStatus}
        saveError={wb.saveError}
        lastSavedAt={wb.lastSavedAt}
        onUndo={() => {
          if (editingRef.current) cancelEdit();
          wb.undo();
          focusGrid();
        }}
        onRedo={() => {
          if (editingRef.current) cancelEdit();
          wb.redo();
          focusGrid();
        }}
        onLoadDemo={loadDemo}
        onClearAll={() => {
          if (editingRef.current) cancelEdit();
          wb.clearAll();
          focusGrid();
        }}
      />
      <FormulaBar
        addr={activeAddr}
        selectionLabel={describe(selection)}
        value={barValue}
        editing={editing?.source === 'bar'}
        onFocus={() => {
          if (editingRef.current?.source === 'bar') return;
          if (editingRef.current) commitEdit('none');
          startEdit(activeAddr, undefined, 'bar');
        }}
        onChange={changeEdit}
        onCommit={() => commitEdit('none')}
        onCancel={cancelEdit}
      />
      <div className="app__body">
        {wb.loadStatus === 'loading' ? (
          <div className="grid grid--loading">Loading workbook…</div>
        ) : (
          <Grid
            grid={grid}
            cells={wb.cells}
            selection={selection}
            editing={editing}
            highlights={highlights}
            containerRef={gridRef}
            onSelect={select}
            onMove={move}
            onStartEdit={startEdit}
            onEditChange={changeEdit}
            onCommitEdit={commitEdit}
            onCancelEdit={cancelEdit}
            onClear={clearSelection}
            onSelectAll={selectAll}
            onCopy={copySelection}
            onPaste={pasteText}
            onEscape={collapseSelection}
          />
        )}
        <Inspector cell={activeCell} transitivePrecedents={transitivePrecedents} transitiveDependents={transitiveDependents} onJump={jumpTo} />
      </div>
    </div>
  );
}

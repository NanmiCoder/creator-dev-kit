import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
import { ArrowDown, ArrowDownLeft, ArrowUpRight, Check, CheckCheck, ChevronDown, ChevronRight, CircleHelp, Command, Download, FileSpreadsheet, Grid2X2, Link2, LoaderCircle, PanelRightClose, PanelRightOpen, Plus, Redo2, RotateCcw, Table2, Undo2, X, Zap } from 'lucide-react';
import { COLS, ROWS, History, Spreadsheet, cellId, coordinates, displayValue, isError, rangeIds, type RawCells, type Value } from '../shared/engine';
import { demoCells } from '../shared/demo';

const columns = Array.from({ length: COLS }, (_, i) => String.fromCharCode(65 + i));
const rows = Array.from({ length: ROWS }, (_, i) => i);
const format = (value: Value) => typeof value === 'number' ? value.toLocaleString('zh-CN', { maximumFractionDigits: 8 }) : displayValue(value);
const errorDetails: Record<string, string> = {
  '#CYCLE!': '该单元格的依赖链中存在循环引用。请修改相关公式以解除循环。',
  '#DIV/0!': '公式的除数为零，或 AVG 的计算范围内没有数值。',
  '#REF!': '引用超出了当前工作簿的范围（A1:L40）。',
  '#VALUE!': '公式语法、参数数量或数据类型有误。请检查公式及引用内容。',
  '#NAME?': '函数名称或名称引用无法识别。当前支持 SUM、AVG、ROUND 和 IF。',
  '#NUM!': '计算结果超出可表示的数值范围，请调整输入或舍入位数。',
};

export default function App() {
  const [sheet, setSheet] = useState<Spreadsheet | null>(null);
  const history = useRef<History | null>(null);
  const [, render] = useState(0);
  const [selected, setSelected] = useState('D9');
  const [anchor, setAnchor] = useState('D9');
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [formulaFocused, setFormulaFocused] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);
  const [inspector, setInspector] = useState(true);
  const [tab, setTab] = useState<'cell' | 'activity'>('cell');
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'error'>('saved');
  const [loadError, setLoadError] = useState('');
  const [modal, setModal] = useState<'help' | 'new' | null>(null);
  const [notice, setNotice] = useState('');
  const [activity, setActivity] = useState<{ text: string; count: number; time: string }[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLInputElement>(null);
  const formulaRef = useRef<HTMLInputElement>(null);
  const pending = useRef<RawCells>({});
  const saving = useRef(false);
  const cancelledEdit = useRef(false);

  useEffect(() => {
    let alive = true;
    fetch('/api/workbook').then(r => { if (!r.ok) throw new Error('无法连接工作簿服务器，请稍后重试。'); return r.json(); })
      .then(data => { if (alive) { const next = new Spreadsheet(data.cells); history.current = new History(next); setSheet(next); } })
      .catch(e => { if (alive) setLoadError('无法加载工作簿，请检查服务是否启动后重试。'); });
    return () => { alive = false; };
  }, []);

  const flush = useCallback(async () => {
    if (saving.current || !Object.keys(pending.current).length) return;
    saving.current = true;
    setSaveState('saving');
    while (Object.keys(pending.current).length) {
      const cells = pending.current;
      pending.current = {};
      try {
        const result = await fetch('/api/workbook', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cells }) });
        if (!result.ok) throw new Error('保存失败');
      } catch {
        pending.current = { ...cells, ...pending.current };
        setSaveState('error'); saving.current = false; return;
      }
    }
    saving.current = false; setSaveState('saved');
  }, []);

  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (saving.current || Object.keys(pending.current).length || editing || formulaFocused) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [editing, formulaFocused]);
  useEffect(() => { if (editing) { editRef.current?.focus(); editRef.current?.setSelectionRange(draft.length, draft.length); } }, [editing]);
  useEffect(() => { if (notice) { const timeout = setTimeout(() => setNotice(''), 4000); return () => clearTimeout(timeout); } }, [notice]);

  const record = (before: RawCells, label: string) => {
    if (!sheet) return;
    const ids = new Set([...Object.keys(before), ...Object.keys(sheet.raw)]);
    const changes: RawCells = {};
    ids.forEach(id => { if ((before[id] ?? '') !== (sheet.raw[id] ?? '')) changes[id] = sheet.raw[id] ?? ''; });
    if (!Object.keys(changes).length) return;
    pending.current = { ...pending.current, ...changes }; void flush();
    setActivity(log => [{ text: label, count: sheet.lastRecalculated.length, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }, ...log].slice(0, 50));
    render(n => n + 1);
  };
  const apply = (edits: RawCells, label?: string) => {
    if (!sheet) return;
    const before = { ...sheet.raw };
    if (history.current?.edit(edits)) record(before, label ?? `已编辑 ${Object.keys(edits).join('、')}`);
  };
  const undoRedo = (redo = false) => {
    if (!sheet) return;
    const before = { ...sheet.raw };
    if (redo ? history.current?.redo() : history.current?.undo()) record(before, redo ? '已重做编辑' : '已撤销编辑');
    gridRef.current?.focus();
  };
  const select = (id: string, extend = false, focus = true) => {
    setSelected(id); if (!extend) setAnchor(id);
    if (focus) gridRef.current?.focus();
  };
  const move = (dr: number, dc: number, extend = false) => {
    const [r, c] = coordinates(selected);
    const id = cellId(Math.max(0, Math.min(ROWS - 1, r + dr)), Math.max(0, Math.min(COLS - 1, c + dc)));
    select(id, extend);
    document.getElementById(`cell-${id}`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };
  const beginEdit = (initial?: string) => { if (!sheet) return; cancelledEdit.current = false; setDraft(initial ?? sheet.raw[selected] ?? ''); setEditing(selected); };
  const commit = (id: string, raw: string) => { apply({ [id]: raw }); setEditing(null); };
  const selection = new Set(rangeIds(anchor, selected));
  const copy = (e: ClipboardEvent) => {
    if (editing || formulaFocused || !sheet) return;
    e.preventDefault();
    const [r1, c1] = coordinates(anchor), [r2, c2] = coordinates(selected);
    const text: string[] = [];
    for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) {
      const line: string[] = [];
      for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) line.push(sheet.raw[cellId(r, c)] ?? '');
      text.push(line.join('\t'));
    }
    e.clipboardData.setData('text/plain', text.join('\n'));
    setNotice(`已复制 ${selection.size} 个单元格`);
  };
  const paste = (e: ClipboardEvent) => {
    if (editing || formulaFocused) return;
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain').replace(/\r\n?/g, '\n').replace(/\n$/, '');
    const [r, c] = coordinates(selected), edits: RawCells = {};
    text.split('\n').forEach((line, ri) => line.split('\t').forEach((raw, ci) => {
      if (r + ri < ROWS && c + ci < COLS) edits[cellId(r + ri, c + ci)] = raw.slice(0, 10000);
    }));
    apply(edits, `已粘贴 ${Object.keys(edits).length} 个单元格`);
  };
  const keyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (editing || formulaFocused) return;
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); undoRedo(e.shiftKey); return; }
    if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); undoRedo(true); return; }
    if (mod && e.key === 'a') { e.preventDefault(); setAnchor('A1'); setSelected('L40'); return; }
    if (mod) return;
    const moves: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], Tab: [0, e.shiftKey ? -1 : 1] };
    if (moves[e.key]) { e.preventDefault(); move(...moves[e.key], e.shiftKey && e.key !== 'Tab'); }
    else if (e.key === 'Enter' || e.key === 'F2') { e.preventDefault(); beginEdit(); }
    else if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); apply(Object.fromEntries([...selection].map(id => [id, ''])), `已清空 ${selection.size} 个单元格`); }
    else if (e.key === 'Escape') setAnchor(selected);
    else if (e.key.length === 1 && !e.altKey) { e.preventDefault(); beginEdit(e.key); }
  };
  const exportCsv = () => {
    if (!sheet) return;
    const csv = rows.map(r => columns.map((_, c) => `"${displayValue(sheet.value(cellId(r, c))).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = '工作室预算.csv'; a.click(); URL.revokeObjectURL(url); setNotice('工作簿已导出为 CSV');
  };

  if (!sheet) return <div className="loading-screen"><div className="brand-symbol">f<span>•</span></div><h1>正在打开工作簿</h1>{loadError ? <><p role="alert">{loadError}</p><button className="primary" onClick={() => location.reload()}>重试</button></> : <LoaderCircle className="spin" size={22} />}</div>;

  const upstream = sheet.related(selected, 'dependencies');
  const downstream = sheet.related(selected, 'dependents');
  const directUp = sheet.related(selected, 'dependencies', false);
  const directDown = sheet.related(selected, 'dependents', false);
  const raw = sheet.raw[selected] ?? '';
  const value = sheet.value(selected);
  const formula = raw.trimStart().startsWith('=');
  const errors = [...sheet.values.values()].filter(isError).length;
  const formulas = Object.values(sheet.raw).filter(v => v.trimStart().startsWith('=')).length;
  const selectedNumbers = [...selection].map(id => sheet.value(id)).filter((v): v is number => typeof v === 'number');
  const relationList = (ids: Set<string>, direct: Set<string>, kind: string) => <div className="relation-list">{ids.size ? [...ids].map(id => <button key={id} onClick={() => select(id)} className="relation-row"><span className={`address ${kind}`}>{id}</span><span className="relation-formula">{sheet.raw[id]?.startsWith('=') ? sheet.raw[id] : format(sheet.value(id)) || '空单元格'}</span>{!direct.has(id) && <span className="indirect">间接</span>}<ChevronRight size={13} /></button>) : <p className="empty-relation">{kind === 'upstream' ? '此单元格未引用其他单元格。' : '暂无其他单元格依赖此单元格。'}</p>}</div>;

  return <div className="app">
    <aside className="rail" aria-label="应用导航">
      <a className="brand-symbol" href="#" aria-label="Folio 首页" onClick={e => { e.preventDefault(); select('A1'); }}>f<span>•</span></a>
      <button className="rail-button active" title="工作簿" aria-label="工作簿" onClick={() => gridRef.current?.focus()}><Table2 size={20} /></button>
      <button className="rail-button" title="新建工作簿" aria-label="新建工作簿" onClick={() => setModal('new')}><Plus size={21} /></button>
      <div className="rail-bottom"><button className="rail-button" title="键盘快捷键" aria-label="键盘快捷键" onClick={() => setModal('help')}><CircleHelp size={20} /></button><div className="avatar" title="本地工作区">S</div></div>
    </aside>
    <div className="workspace">
      <header className="topbar"><div className="breadcrumb">工作区 <ChevronRight size={13} /> <span>我的工作簿</span></div><div className="local-badge"><span /> 本地工作区</div></header>
      <section className="workbook-header">
        <div><div className="eyebrow"><FileSpreadsheet size={14} /> 让每个想法，彼此相连</div><div className="title-line"><h1>工作室预算</h1><span className="workbook-tag">工作簿</span></div><p>一张小表，让每笔预算清清楚楚。</p></div>
        <div className="header-actions"><button className={`save-status ${saveState}`} onClick={() => { if (saveState === 'error') void flush(); }} disabled={saveState !== 'error'} aria-live="polite">{saveState === 'saved' ? <CheckCheck size={16} /> : saveState === 'saving' ? <LoaderCircle size={15} className="spin" /> : <RotateCcw size={15} />}{saveState === 'saved' ? '所有更改已保存' : saveState === 'saving' ? '正在保存…' : '保存失败 · 点击重试'}</button><button className="button export-button" onClick={exportCsv}><Download size={15} /> 导出 CSV</button></div>
      </section>
      <main className={`workbench ${inspector ? '' : 'inspector-hidden'}`}>
        <div className="sheet-panel">
          <div className="toolbar"><div className="toolbar-group"><button className="icon-button" aria-label="撤销" title="撤销（⌘/Ctrl Z）" disabled={!history.current?.canUndo} onClick={() => undoRedo()}><Undo2 size={17} /></button><button className="icon-button" aria-label="重做" title="重做（⌘/Ctrl Shift Z）" disabled={!history.current?.canRedo} onClick={() => undoRedo(true)}><Redo2 size={17} /></button><span className="separator" /><span className="toolbar-label"><Grid2X2 size={14} /> 40 行 × 12 列</span></div><div className="toolbar-group"><button className={`formula-toggle ${showFormulas ? 'on' : ''}`} onClick={() => setShowFormulas(v => !v)} aria-pressed={showFormulas}><span className="fx">ƒx</span> 显示公式<span className="toggle-track"><span /></span></button><span className="separator" /><button className="icon-button" title="显示或隐藏单元格详情" aria-label="显示或隐藏单元格详情" aria-expanded={inspector} onClick={() => setInspector(v => !v)}>{inspector ? <PanelRightClose size={17} /> : <PanelRightOpen size={17} />}</button></div></div>
          <div className="formula-bar"><div className="name-box">{selection.size > 1 ? `${anchor}:${selected}` : selected}<ChevronDown size={11} /></div><span className="fx">ƒx</span><input ref={formulaRef} aria-label="公式栏" value={formulaFocused ? draft : editing ? draft : raw} placeholder="输入内容，或以 = 开始编写公式" maxLength={10000} onFocus={() => { cancelledEdit.current = false; setFormulaFocused(true); setDraft(raw); }} onChange={e => setDraft(e.target.value)} onBlur={() => { if (!cancelledEdit.current) apply({ [selected]: draft }); cancelledEdit.current = false; setFormulaFocused(false); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); formulaRef.current?.blur(); gridRef.current?.focus(); } if (e.key === 'Escape') { cancelledEdit.current = true; formulaRef.current?.blur(); gridRef.current?.focus(); } }} />{(editing || formulaFocused) && <span className="editing-hint">↵ 确认</span>}</div>
          <div className="grid-scroll" ref={gridRef} role="grid" aria-label="工作室预算表格" aria-rowcount={ROWS + 1} aria-colcount={COLS + 1} aria-activedescendant={`cell-${selected}`} tabIndex={0} onKeyDown={keyDown} onCopy={copy} onPaste={paste}>
            <table className="spreadsheet"><colgroup><col className="row-number-col" />{columns.map(c => <col key={c} className={`col-${c}`} />)}</colgroup><thead><tr><th className="corner" onClick={() => { setAnchor('A1'); setSelected('L40'); gridRef.current?.focus(); }} aria-label="选择所有单元格"><span /></th>{columns.map((c, i) => <th key={c} scope="col" className={coordinates(selected)[1] === i ? 'selected-header' : ''}>{c}</th>)}</tr></thead><tbody>{rows.map(r => <tr key={r}><th scope="row" className={coordinates(selected)[0] === r ? 'selected-header' : ''}>{r + 1}</th>{columns.map((c, ci) => {
              const id = cellId(r, ci), v = sheet.value(id), isSelected = selected === id, isUp = upstream.has(id), isDown = downstream.has(id), cellRaw = sheet.raw[id] ?? '';
              const className = [isSelected ? 'selected-cell' : selection.has(id) ? 'range-selected' : '', isUp ? 'reference-cell' : '', isDown ? 'dependent-cell' : '', isError(v) ? 'error-cell' : '', typeof v === 'number' ? 'number-cell' : '', r === 2 && ci < 4 || id === 'G3' ? 'label-cell' : '', r === 11 && ci < 4 ? 'total-cell' : '', id === 'A1' ? 'sheet-eyebrow' : '', id === 'A15' ? 'note-heading' : '', id === 'A16' ? 'note-text' : ''].join(' ');
              return <td key={id} id={`cell-${id}`} role="gridcell" aria-label={`${id}${cellRaw ? `: ${displayValue(v)}` : ''}`} aria-selected={selection.has(id)} data-cell={id} data-raw={cellRaw} data-value={displayValue(v)} className={className} title={cellRaw.startsWith('=') ? `${id}: ${cellRaw} → ${displayValue(v)}` : `${id}: ${cellRaw}`} onMouseDown={e => { if ((e.target as HTMLElement).tagName === 'INPUT') return; e.preventDefault(); if (editing) commit(editing, draft); select(id, e.shiftKey); }} onDoubleClick={() => { select(id, false, false); cancelledEdit.current = false; setDraft(cellRaw); setEditing(id); }}>
                {editing === id ? <input ref={editRef} className="cell-editor" aria-label={`编辑 ${id}`} value={draft} maxLength={10000} onChange={e => setDraft(e.target.value)} onBlur={() => { if (!cancelledEdit.current) commit(id, draft); }} onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); cancelledEdit.current = true; commit(id, draft); move(e.key === 'Enter' ? (e.shiftKey ? -1 : 1) : 0, e.key === 'Tab' ? (e.shiftKey ? -1 : 1) : 0); } if (e.key === 'Escape') { cancelledEdit.current = true; setEditing(null); gridRef.current?.focus(); } }} /> : <span className="cell-content">{showFormulas && cellRaw.startsWith('=') ? cellRaw : format(v)}</span>}
                {cellRaw.startsWith('=') && !editing && <span className="formula-corner" />}{isSelected && <span className="selection-handle" />}
              </td>;
            })}</tr>)}</tbody></table>
          </div>
          <div className="sheet-tabs"><div className="sheet-tab"><Table2 size={14} /> 工作室预算 <span /></div><button className="icon-button" aria-label="新建空白工作簿" title="新建空白工作簿" onClick={() => setModal('new')}><Plus size={16} /></button><div className="sheet-tab-meta">{formulas} 个公式 <span>·</span> {errors ? <span className="error-count">{errors} 个错误</span> : '计算正常'}</div></div>
        </div>
        {inspector && <aside className="inspector"><div className="inspector-tabs"><button className={tab === 'cell' ? 'active' : ''} onClick={() => setTab('cell')}>单元格详情</button><button className={tab === 'activity' ? 'active' : ''} onClick={() => setTab('activity')}>操作记录{activity.length > 0 && <span className="activity-dot" />}</button></div>
          {tab === 'cell' ? <div className="inspector-content"><div className="selected-cell-heading"><div className="cell-address-large">{selected}</div><span className={`type-badge ${isError(value) ? 'error-badge' : ''}`}>{isError(value) ? '错误' : formula ? '公式' : typeof value === 'number' ? '数值' : typeof value === 'boolean' ? '逻辑值' : raw ? '文本' : '空白'}</span></div><div className="result-label">计算结果</div><div className={`computed-value ${isError(value) ? 'error-color' : ''}`}>{format(value) || <span className="muted">—</span>}</div>{isError(value) && <p className="error-explanation">{errorDetails[value.error]}</p>}<div className="raw-box"><span className="fx">{formula ? 'ƒx' : 'Aa'}</span><code>{raw || '尚未输入内容'}</code><button className="edit-formula" title="编辑选中单元格" aria-label="编辑选中单元格" onClick={() => { formulaRef.current?.focus(); }}>↗</button></div>
          <div className="section-divider" /><div className="section-heading"><Link2 size={15} /><h2>关联单元格</h2><span className="count-badge">{new Set([...upstream, ...downstream]).size}</span></div><p className="section-description">查看数值来源，追踪影响范围。</p>
          <div className="relation-title"><span className="legend-dot upstream" /><span>引用来源</span><span className="relation-count">{upstream.size}</span><ArrowDownLeft size={14} /></div>{relationList(upstream, directUp, 'upstream')}
          <div className="relation-title downstream-title"><span className="legend-dot downstream" /><span>依赖此单元格</span><span className="relation-count">{downstream.size}</span><ArrowUpRight size={14} /></div>{relationList(downstream, directDown, 'downstream')}
          <div className="dependency-flow"><span className="mini-label">一处修改，逐级更新</span><div className="flow-nodes"><div className="flow-node upstream">{upstream.size} 个来源</div><div className="flow-connector" /><div className="flow-node selected">{selected}</div><div className="flow-connector" /><div className="flow-node downstream">{downstream.size} 个关联</div></div><p>修改一次，所有关联单元格同步更新。</p></div>
          <div className="inspector-tip"><Zap size={16} /><p>试试将 <button onClick={() => select('B4')}>B4</button> 从 24 改为 30。<br />看看整份预算如何自动更新。</p></div>
          </div> : <div className="activity-content"><div className="section-heading"><Zap size={16} /><h2>工作簿动态</h2></div><p className="section-description">查看本次打开后的编辑与重算记录。</p>{activity.length ? activity.map((entry, i) => <div className="activity-item" key={i}><span className="activity-mark"><Check size={12} /></span><div><strong>{entry.text}</strong><p>已重算 {entry.count} 个单元格</p></div><time>{entry.time}</time></div>) : <div className="activity-empty"><Link2 size={27} /><h3>等待你的第一次编辑</h3><p>编辑任意单元格，即可在这里查看重算记录。</p></div>}</div>}
        </aside>}
      </main>
      <footer className="statusbar"><div><span className={`status-dot ${errors ? 'has-error' : ''}`} /><span>{errors ? `${errors} 个单元格出错` : '就绪'}</span><span className="footer-divider" /><Zap size={12} /><span>已重算 {sheet.lastRecalculated.length} 个单元格 <span className="muted">，耗时 {sheet.lastDuration.toFixed(1)} 毫秒</span></span></div><div>{selection.size > 1 ? <span>已选 {selection.size} 个 · 求和： {format(selectedNumbers.reduce((a, b) => a + b, 0))}</span> : <><span className="footer-key"><span>↵</span> 编辑单元格</span><span className="footer-key"><span>↑↓←→</span> 移动选择</span></>}<button onClick={() => setModal('help')} aria-label="查看键盘快捷键"><Command size={13} /> 快捷键</button></div></footer>
    </div>
    {notice && <div className="toast" role="status"><Check size={16} />{notice}</div>}
    {modal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null); }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onKeyDown={e => { if (e.key === 'Escape') setModal(null); if (e.key === 'Tab') { const focusables = [...e.currentTarget.querySelectorAll<HTMLElement>('button')]; const first = focusables[0], last = focusables.at(-1); if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); } } }}><button autoFocus className="icon-button modal-close" aria-label="关闭对话框" onClick={() => { setModal(null); gridRef.current?.focus(); }}><X size={18} /></button><div className="modal-icon">{modal === 'help' ? <Command size={24} /> : <FileSpreadsheet size={24} />}</div><h2 id="modal-title">{modal === 'help' ? '用快捷键，编辑更顺手。' : '从一张新表开始。'}</h2>{modal === 'help' ? <><p>熟悉这些操作，让表格编辑更轻松。</p><div className="shortcut-list">{[['移动选择', '↑ ↓ ← → / Tab'], ['编辑选中单元格', 'Enter / F2'], ['确认编辑', 'Enter'], ['取消编辑', 'Esc'], ['扩展选区', 'Shift + 方向键 / 单击'], ['复制 / 粘贴单元格', '⌘ / Ctrl + C / V'], ['撤销', '⌘ / Ctrl + Z'], ['重做', '⌘ / Ctrl + Shift + Z'], ['清空选中单元格', 'Delete / Backspace']].map(([label, key]) => <div key={label}><span>{label}</span><kbd>{key}</kbd></div>)}</div><div className="formula-help"><strong>用公式，让数值自动联动。</strong><code>=IF(D8&gt;200, ROUND(D8*8%, 2), 0)</code><span>支持 + − * /、百分号、括号、比较运算、文本与单元格引用。可用 SUM 求和、AVG 求平均、ROUND 四舍五入和 IF 条件判断；IF 仅计算选中的分支。</span></div></> : <><p>创建空白表格，或恢复预算示例。这会替换当前单元格内容，之后可以撤销。</p><div className="modal-actions"><button className="button" onClick={() => { apply(Object.fromEntries([...new Set([...Object.keys(sheet.raw), ...Object.keys(demoCells)])].map(id => [id, demoCells[id] ?? ''])), '已恢复示例'); setModal(null); select('D9'); }}>恢复示例</button><button className="primary" onClick={() => { apply(Object.fromEntries(Object.keys(sheet.raw).map(id => [id, ''])), '已创建空白工作簿'); setModal(null); select('A1'); }}>创建空白表格 <ArrowUpRight size={15} /></button></div></>}</div></div>}
  </div>;
}

import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { CaretDown, MagnifyingGlass, TreeStructure } from '@phosphor-icons/react';
import { useStore } from '../store';
import { ARRAYS, TURBINES, statusOf, type TurbineState } from '../data/world';
import { powerAt } from '../data/weather';
import { STATUS_LABEL } from '../data/ops';
import { AnimatedNumber } from './Glass';

/* 左侧资产树：A-D 阵列 × 24 风机，搜索 / 折叠 / 状态过滤，与 3D 双向同步 */

const FILTERS: Array<{ value: 'all' | TurbineState; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'normal', label: '正常' },
  { value: 'derated', label: '限功率' },
  { value: 'offline', label: '离线' },
  { value: 'maintenance', label: '待维护' },
];

export function AssetTree() {
  const t = useStore((s) => s.t);
  useStore((s) => s.twinVersion);
  const selected = useStore((s) => s.selected);
  const query = useStore((s) => s.query);
  const setQuery = useStore((s) => s.setQuery);
  const statusFilter = useStore((s) => s.statusFilter);
  const setStatusFilter = useStore((s) => s.setStatusFilter);
  const collapsed = useStore((s) => s.collapsed);
  const toggleArray = useStore((s) => s.toggleArray);
  const select = useStore((s) => s.select);

  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TURBINES.filter((tb) => {
      if (statusFilter !== 'all' && statusOf(tb.id) !== statusFilter) return false;
      if (q && !tb.code.toLowerCase().includes(q) && !tb.array.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, statusFilter]);

  // 3D 选中 → 展开阵列 + 滚动到条目（双向同步）
  useEffect(() => {
    if (selected === null) return;
    const tb = TURBINES[selected];
    if (collapsed[tb.array]) toggleArray(tb.array);
    const el = itemRefs.current[selected];
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="panel glass panel-tree">
      <div className="panel-head">
        <TreeStructure size={16} weight="duotone" style={{ color: 'var(--ink-2)' }} />
        <span className="label" style={{ color: 'var(--ink-2)' }}>资产</span>
        <span className="mono tree-count">{matches.length}/24</span>
      </div>

      <div className="tree-search">
        <MagnifyingGlass size={14} style={{ color: 'var(--ink-3)' }} />
        <input
          className="tree-input"
          placeholder="搜索机组 T-05 / 阵列 C"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="搜索机组"
        />
      </div>

      <div className="tree-filters">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`tree-filter ${statusFilter === f.value ? 'is-active' : ''}`}
            onClick={() => setStatusFilter(f.value)}
          >
            {f.value !== 'all' && <span className={`dot dot-st-${f.value}`} />}
            {f.label}
          </button>
        ))}
      </div>

      <div className="panel-body tree-body" ref={listRef}>
        {matches.length === 0 && (
          <div className="tree-empty">
            <span className="tree-empty-title">未找到匹配机组</span>
            <span className="tree-empty-hint">试试其他编号或清除状态过滤</span>
            <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => { setQuery(''); setStatusFilter('all'); }}>
              清除过滤
            </button>
          </div>
        )}

        {ARRAYS.map((arr) => {
          const items = matches.filter((tb) => tb.array === arr);
          if (items.length === 0 && !collapsed[arr]) return null;
          const all = TURBINES.filter((tb) => tb.array === arr);
          const summary = ['normal', 'derated', 'offline', 'maintenance'].map((st) =>
            all.some((tb) => statusOf(tb.id) === st) ? st : null,
          );
          return (
            <div key={arr} className="tree-array">
              <button className="tree-array-head" onClick={() => toggleArray(arr)}>
                <motion.span animate={{ rotate: collapsed[arr] ? -90 : 0 }} transition={{ duration: 0.2 }}>
                  <CaretDown size={12} />
                </motion.span>
                <span className="mono tree-array-letter">{arr}</span>
                <span className="label" style={{ fontSize: 10 }}>阵列</span>
                <span className="tree-array-dots">
                  {summary.map((st, i) => (st ? <span key={i} className={`dot dot-st-${st}`} /> : <span key={i} className="dot" style={{ background: 'transparent' }} />))}
                </span>
                <span className="mono tree-array-count">{items.length}</span>
              </button>
              {!collapsed[arr] && (
                <div className="tree-items">
                  {items.map((tb) => (
                    <button
                      key={tb.id}
                      ref={(el) => { itemRefs.current[tb.id] = el; }}
                      className={`tree-item ${selected === tb.id ? 'is-selected' : ''}`}
                      onClick={() => select(tb.id, { focus: true })}
                    >
                      <span className={`dot dot-st-${statusOf(tb.id)}`} />
                      <span className="mono tree-item-code">{tb.code}</span>
                      <span className="tree-item-status" style={{ color: `var(--st-${statusOf(tb.id)})` }}>{STATUS_LABEL[statusOf(tb.id)]}</span>
                      <span className="mono tree-item-pw">
                        {statusOf(tb.id) === 'offline' ? '--' : <AnimatedNumber value={powerAt(t, tb.id)} format={(v) => `${v.toFixed(1)}`} />} MW
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

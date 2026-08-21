import { AnimatePresence, motion } from 'motion/react';
import { TreeStructure, UserGear, ShieldWarning, X } from '@phosphor-icons/react';
import { useStore, type SheetTab } from '../store';
import { activeAlerts } from '../data/ops';
import { AssetTree } from './AssetTree';
import { ContextPanel } from './ContextPanel';
import { AlertCenter } from './AlertCenter';

/* 移动端/平板：底部玻璃抽屉（资产 / 机组 / 告警），保留选中、时间轴与视图切换 */

const TABS: Array<{ id: SheetTab; label: string; icon: React.ReactNode }> = [
  { id: 'assets', label: '资产', icon: <TreeStructure size={15} weight="duotone" /> },
  { id: 'detail', label: '机组', icon: <UserGear size={15} weight="duotone" /> },
  { id: 'alerts', label: '告警', icon: <ShieldWarning size={15} weight="duotone" /> },
];

export function Sheet() {
  const tab = useStore((s) => s.sheetTab);
  const setTab = useStore((s) => s.setSheetTab);
  const selected = useStore((s) => s.selected);
  const t = useStore((s) => s.t);
  useStore((s) => s.twinVersion);

  const open = tab !== null;
  const activeTab = tab ?? 'assets';

  return (
    <>
      {/* 抽屉开关（未打开时） */}
      <div className="sheet-toggles">
        <AnimatePresence>
          {!open && (
            <motion.div
              className="sheet-toggles-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              {TABS.map((tb) => (
                <button
                  key={tb.id}
                  className={`btn icon-btn sheet-toggle ${tb.id === 'detail' && selected !== null ? 'is-active' : ''}`}
                  title={tb.label}
                  aria-label={tb.label}
                  onClick={() => setTab(tb.id)}
                >
                  {tb.icon}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="sheet glass"
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            exit={{ y: '105%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="sheet-grab" />
            <div className="sheet-head">
              <div className="sheet-tabs" role="tablist">
                {TABS.map((tb) => (
                  <button
                    key={tb.id}
                    role="tab"
                    aria-selected={activeTab === tb.id}
                    className={`sheet-tab ${activeTab === tb.id ? 'is-active' : ''}`}
                    onClick={() => setTab(tb.id)}
                  >
                    {tb.icon}
                    {tb.label}
                    {tb.id === 'alerts' && activeAlerts(t).length > 0 && <span className="badge">{activeAlerts(t).length}</span>}
                  </button>
                ))}
              </div>
              <button className="btn icon-btn btn-ghost" style={{ width: 30, height: 30 }} aria-label="关闭抽屉" onClick={() => setTab(null)}>
                <X size={14} />
              </button>
            </div>
            <div className="sheet-body">
              {activeTab === 'assets' && <AssetTree />}
              {activeTab === 'detail' && <ContextPanel compact />}
              {activeTab === 'alerts' && <AlertCenter force />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

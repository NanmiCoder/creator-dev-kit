import { create } from 'zustand';
import { WIN_START, WIN_MS } from './lib/util';
import { liveNow } from './data/weather';
import type { ViewMode } from './data/ops';
import type { TurbineState } from './data/world';

/* ============================================================
   单一状态源：3D 选择 / 资产树 / 告警 / 时间轴 / 详情面板 / 维护表单
   ============================================================ */

export interface FocusRequest { id: number | null; n: number }
export interface Toast { id: number; msg: string; kind: 'info' | 'success' | 'error' }
export interface CreatedTask {
  id: string;
  turbine: number;
  title: string;
  when: string;
  severity: string;
  tech: string;
  createdAt: number;
}
export type SheetTab = 'assets' | 'detail' | 'alerts';

interface AppState {
  /* 启动 */
  bootProgress: number;
  bootDone: boolean;
  sceneReady: boolean;
  webglFailed: boolean;
  visible: boolean;

  /* 时间轴 */
  t: number;
  live: boolean;

  /* 视图 */
  viewMode: ViewMode;
  selected: number | null;
  hoverId: number | null;
  focusReq: FocusRequest | null;
  alertOpen: boolean;
  cinema: boolean;
  introDone: boolean;

  /* 移动端 */
  sheetTab: SheetTab | null;

  /* 维护任务 */
  taskFormOpen: boolean;

  /* 资产树 */
  query: string;
  statusFilter: 'all' | TurbineState;
  collapsed: Record<string, boolean>;

  /* 杂项 */
  toasts: Toast[];
  tasks: CreatedTask[];
  /** 风机运行态覆盖版本号（SCADA 重连等，触发依赖 statusOf 的组件重渲染） */
  twinVersion: number;

  /* actions */
  tickBoot: (v: number) => void;
  setBootDone: () => void;
  setSceneReady: () => void;
  failWebgl: () => void;
  setVisible: (v: boolean) => void;
  setTime: (t: number, live: boolean) => void;
  goLive: () => void;
  setViewMode: (m: ViewMode) => void;
  setHover: (id: number | null) => void;
  select: (id: number | null, opts?: { focus?: boolean; fly?: boolean; view?: ViewMode }) => void;
  requestFocus: (id: number | null) => void;
  setAlertOpen: (v: boolean) => void;
  setCinema: (v: boolean) => void;
  setIntroDone: () => void;
  setSheetTab: (v: SheetTab | null) => void;
  setTaskFormOpen: (v: boolean) => void;
  setQuery: (q: string) => void;
  setStatusFilter: (f: 'all' | TurbineState) => void;
  toggleArray: (a: string) => void;
  toast: (msg: string, kind?: Toast['kind']) => void;
  dismissToast: (id: number) => void;
  addTask: (task: CreatedTask) => void;
  bumpTwin: () => void;
}

let toastSeq = 0;
let focusSeq = 0;

export const useStore = create<AppState>((set, get) => ({
  bootProgress: 0,
  bootDone: false,
  sceneReady: false,
  webglFailed: false,
  visible: true,

  t: liveNow(),
  live: true,

  viewMode: 'live',
  selected: null,
  hoverId: null,
  focusReq: null,
  alertOpen: false,
  cinema: false,
  introDone: false,

  sheetTab: null,
  taskFormOpen: false,

  query: '',
  statusFilter: 'all',
  collapsed: {},

  toasts: [],
  tasks: [],
  twinVersion: 0,

  tickBoot: (v) => set({ bootProgress: Math.max(get().bootProgress, v) }),
  setBootDone: () => set({ bootDone: true }),
  setSceneReady: () => set({ sceneReady: true }),
  failWebgl: () => set({ webglFailed: true, bootDone: true }),
  setVisible: (v) => set({ visible: v }),

  setTime: (t, live) => set({ t: Math.max(WIN_START - 30_000, t), live }),
  goLive: () => set({ t: liveNow(), live: true }),

  setViewMode: (m) => set({ viewMode: m }),

  setHover: (id) => set((s) => (s.hoverId === id ? s : { hoverId: id })),

  select: (id, opts = {}) => {
    const s = get();
    const next: Partial<AppState> = { selected: id };
    if (opts.view) next.viewMode = opts.view;
    if (opts.focus !== false) {
      next.focusReq = { id: id ?? null, n: ++focusSeq };
      // 聚焦时退出电影模式
      if (id !== null && s.cinema) next.cinema = false;
      if (id !== null) next.sheetTab = 'detail';
    }
    set(next);
  },

  requestFocus: (id) => set({ focusReq: { id, n: ++focusSeq } }),

  setAlertOpen: (v) => set({ alertOpen: v }),
  setCinema: (v) => set({ cinema: v }),
  setIntroDone: () => set({ introDone: true }),
  setSheetTab: (v) => set({ sheetTab: v }),
  setTaskFormOpen: (v) => set({ taskFormOpen: v }),

  setQuery: (q) => set({ query: q }),
  setStatusFilter: (f) => set({ statusFilter: f }),
  toggleArray: (a) => {
    const c = get().collapsed;
    set({ collapsed: { ...c, [a]: !c[a] } });
  },

  toast: (msg, kind = 'info') => {
    const id = ++toastSeq;
    set({ toasts: [...get().toasts, { id, msg, kind }] });
    setTimeout(() => get().dismissToast(id), 4200);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

  addTask: (task) => set({ tasks: [...get().tasks, task] }),
  bumpTwin: () => set({ twinVersion: get().twinVersion + 1 }),
}));

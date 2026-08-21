import { DAY_START } from '../lib/util';
import { isRecovered } from './world';

/* ============================================================
   运维数据：告警 / 工单 / 技师 / 维护任务
   窗口：今日 08:48 - 20:48（演示基准）
   ============================================================ */

export type AlertKind = 'vibration' | 'yaw' | 'scada' | 'oil' | 'pitch';
export type Severity = 'low' | 'medium' | 'high';
export type ViewMode = 'live' | 'heat' | 'risk';

export interface AlertDef {
  id: string;
  turbine: number;       // 机组 id
  kind: AlertKind;
  title: string;
  detail: string;
  time: number;          // 发生时刻
  resolvedAt: number | null;
  severity: Severity;
  view: ViewMode;        // 定位时切换的视图
}

const at = (h: number, m: number) => DAY_START.getTime() + (h * 60 + m) * 60_000;

export const ALERTS: AlertDef[] = [
  { id: 'AL-2471', turbine: 17, kind: 'vibration', title: '齿轮箱振动 8.7 mm/s', detail: 'T-18 齿轮箱高速轴振动超限（阈值 4.5），建议停机检查', time: at(9, 51), resolvedAt: null, severity: 'high', view: 'risk' },
  { id: 'AL-2472', turbine: 21, kind: 'scada', title: 'SCADA 信号中断', detail: 'T-22 遥测链路无响应，数据以本地缓存为准', time: at(10, 42), resolvedAt: null, severity: 'high', view: 'live' },
  { id: 'AL-2473', turbine: 6, kind: 'yaw', title: '偏航误差 11.4°', detail: 'T-07 偏航系统跟踪偏差持续高于 8°，输出已限功率', time: at(10, 47), resolvedAt: null, severity: 'medium', view: 'risk' },
  { id: 'AL-2474', turbine: 2, kind: 'oil', title: '齿轮箱油压波动', detail: 'T-03 润滑油压短时波动，油站已自动切换备用回路', time: at(14, 20), resolvedAt: at(14, 41), severity: 'medium', view: 'risk' },
  { id: 'AL-2475', turbine: 10, kind: 'pitch', title: '变桨角偏差 3.1°', detail: 'T-11 叶片 2 变桨角与指令偏差超限，自检后恢复', time: at(16, 33), resolvedAt: at(17, 5), severity: 'low', view: 'live' },
];

/** 当前活动告警（SCADA 重连成功即解除；t 可选：回放时以时间点为准） */
export const activeAlerts = (t?: number) =>
  ALERTS.filter(
    (a) =>
      a.resolvedAt === null &&
      !(a.kind === 'scada' && isRecovered(a.turbine)) &&
      (t === undefined || a.time <= t),
  );

export interface WorkOrder {
  id: string;
  turbine: number;
  title: string;
  assignee: string;
  status: 'open' | 'assigned' | 'done';
  due: string;
  kind: 'inspection' | 'repair' | 'upgrade';
}

export const BASE_ORDERS: WorkOrder[] = [
  { id: 'WO-2417', turbine: 17, title: '齿轮箱振动检查', assignee: '陈宇峰', status: 'assigned', due: '今日 22:00', kind: 'repair' },
  { id: 'WO-2431', turbine: 6, title: '偏航驱动校准', assignee: 'Anna Berg', status: 'assigned', due: '明日 08:00', kind: 'repair' },
  { id: 'WO-2440', turbine: 21, title: 'SCADA 终端排查', assignee: '周启铭', status: 'open', due: '明日 10:00', kind: 'inspection' },
  { id: 'WO-2389', turbine: 17, title: '主轴轴承润滑', assignee: '林晓东', status: 'done', due: '已闭环', kind: 'inspection' },
  { id: 'WO-2362', turbine: 4, title: '叶片前缘检查', assignee: 'Anna Berg', status: 'done', due: '已闭环', kind: 'inspection' },
  { id: 'WO-2355', turbine: 12, title: '变流器模块更换', assignee: 'Sofia Marek', status: 'done', due: '已闭环', kind: 'upgrade' },
  { id: 'WO-2349', turbine: 19, title: '测风雷达标定', assignee: '王佳楠', status: 'done', due: '已闭环', kind: 'inspection' },
  { id: 'WO-2338', turbine: 2, title: '油站滤芯更换', assignee: '林晓东', status: 'done', due: '已闭环', kind: 'inspection' },
];

export const ordersOf = (id: number) => BASE_ORDERS.filter((o) => o.turbine === id);

export interface Technician {
  id: string;
  name: string;
  role: string;
  highAlt: boolean; // 高空作业资质
  available: boolean;
}

export const TECHNICIANS: Technician[] = [
  { id: 'T-101', name: '林晓东', role: '风电技工', highAlt: true, available: true },
  { id: 'T-102', name: '陈宇峰', role: '高空作业', highAlt: true, available: true },
  { id: 'T-103', name: 'Anna Berg', role: '液压专家', highAlt: true, available: false },
  { id: 'T-104', name: '周启铭', role: 'SCADA 工程师', highAlt: false, available: true },
  { id: 'T-105', name: 'Sofia Marek', role: '电气技师', highAlt: false, available: true },
  { id: 'T-106', name: '王佳楠', role: '数据分析', highAlt: false, available: true },
];

export const SEVERITY_META: Record<Severity, { label: string; cls: string }> = {
  high: { label: '高', cls: 'chip-sev-high' },
  medium: { label: '中', cls: 'chip-sev-mid' },
  low: { label: '低', cls: 'chip-sev-low' },
};

export const STATUS_LABEL: Record<string, string> = {
  normal: '正常',
  derated: '限功率',
  offline: '离线',
  maintenance: '待维护',
};

export const STATUS_DESC: Record<string, string> = {
  normal: '运行正常，跟随调度曲线',
  derated: '受偏航误差或调度指令限制输出',
  offline: '遥测链路中断，等待排查',
  maintenance: '振动超限，待维护窗口',
};

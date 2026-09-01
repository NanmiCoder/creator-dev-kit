import type { Job, Robot } from '../../shared/types';
import type { ConnStatus } from './store';

export const JOB_STATUS_LABEL: Record<Job['status'], string> = {
  pending: '待分配',
  assigned: '已分配',
  picking: '取货中',
  delivering: '配送中',
  done: '已完成',
  cancelled: '已取消',
};

export const ROBOT_STATUS_LABEL: Record<Robot['status'], string> = {
  idle: '空闲',
  moving: '移动中',
  waiting: '等待中',
  loading: '装载中',
  unloading: '卸载中',
};

export const PHASE_LABEL: Record<Robot['phase'], string> = {
  idle: '空闲',
  toShelf: '→ 货架',
  toWorkstation: '→ 工作站',
  returning: '→ 泊位',
};

export const CONN_LABEL: Record<ConnStatus, string> = {
  connecting: '连接中',
  open: '已连接',
  closed: '已断开',
  offline: '离线',
};

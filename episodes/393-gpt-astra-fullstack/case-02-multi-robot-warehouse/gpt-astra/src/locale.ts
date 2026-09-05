import type { Priority } from '../shared/types';

export const priorityLabels: Record<Priority, string> = { high: '高', normal: '普通', low: '低' };

const messages: Record<string, string> = {
  'At charging bay · ready for a job': '位于充电泊位，等待分配任务',
  'Loading at shelf pickup point': '正在货架取货点装货',
  'Unloading at workstation': '正在工作站卸货',
  'Yielding to a reserved cell or opposing route': '正在避让已预约格子或对向机器人',
  'Retreating to bay · waiting for a safe task route': '退回泊位，等待安全任务路线',
  'En route to shelf pickup': '正在前往货架取货',
  'Carrying load to workstation': '正在运送货物至工作站',
  'Returning to charging bay': '正在返回充电泊位',
  'Replanning after warehouse map changed': '地图发生变化，正在重新规划路线',
  'Retreating to bay while a safe task route is unavailable': '暂无安全任务路线，正在退回泊位',
  'No complete safe route · waiting for an obstacle or reservation to clear': '暂无完整安全路线，等待障碍移除或预约释放',
  'Warehouse initialized · deterministic seed 2408': '仓库已初始化 · 固定种子 2408',
  'Simulation reset · same seed 2408 · ready to reproduce': '仿真已重置 · 使用相同种子 2408，可复现调度过程',
  'Simulation paused': '仿真已暂停',
  'Simulation resumed': '仿真已继续运行',
  'Select a valid shelf.': '请选择有效的货架。',
  'Select a valid workstation.': '请选择有效的工作站。',
  'Select a valid priority.': '请选择有效的任务优先级。',
  'The active queue is full (100 jobs).': '任务队列已满，最多支持 100 个未完成任务。',
  'Only traversable cells can be changed.': '只能修改可通行格子，货架和墙壁不可修改。',
  'Only queued jobs can be cancelled.': '只能取消尚未分配的排队任务。',
  'Pause the simulation before stepping.': '请先暂停仿真，再进行单步执行。',
  'Invalid simulation speed.': '仿真速度无效。',
  'Unknown simulation command.': '无法识别此仿真指令。',
  'blocked must be a boolean.': '禁用状态必须为布尔值。',
  'API endpoint not found.': '请求的接口不存在。',
  'Invariant: movement into obstacle': '检测到机器人即将进入障碍格',
  'Invariant: non-adjacent movement': '检测到机器人跨越非相邻格子',
  'Invariant: vertex conflict': '检测到多个机器人占用同一格子',
  'Invariant: edge swap': '检测到机器人对向交换位置',
  'Invariant: step application mismatch': '实际位置与预定移动不一致',
  'Failed to fetch': '网络连接失败，请稍后重试。',
  'Load failed': '加载失败，请检查网络连接。',
  'NetworkError when attempting to fetch resource.': '网络连接失败，请稍后重试。',
  Packing: '打包', Dispatch: '发运', Quality: '质检', Outbound: '出库',
};

// Localize at display time so saved English logs and waiting reasons become
// Chinese immediately, without rewriting the persisted run or its sequence.
export function translateMessage(message: string): string {
  if (messages[message]) return messages[message];
  let match: RegExpMatchArray | null;
  if ((match = message.match(/^(JOB-\d+) created · (S\d+) → (WS-\d+) · (high|normal|low) priority$/))) {
    return `${match[1]} 已创建 · ${match[2]} → ${match[3]} · ${priorityLabels[match[4] as Priority]}优先级`;
  }
  if ((match = message.match(/^(JOB-\d+) assigned to (R-\d+) · complete trip reserved$/))) {
    return `${match[1]} 已分配给 ${match[2]} · 完整行程已预约`;
  }
  if ((match = message.match(/^(R-\d+) (route reserved|replanned|yielding back to bay) · (\d+) ticks(?: · (\d+) reserved waits)?$/))) {
    const action = { 'route reserved': '已预约路线', replanned: '已重新规划', 'yielding back to bay': '正在避让并返回泊位' }[match[2]];
    return `${match[1]} ${action} · ${match[3]} 步${match[4] ? ` · 预约等待 ${match[4]} 步` : ''}`;
  }
  if ((match = message.match(/^(R-\d+) holding position · no safe route available$/))) return `${match[1]} 保持原位 · 暂无安全路线`;
  if ((match = message.match(/^Cell (\[\d+, \d+\]) (blocked|reopened) · all routes recalculated$/))) {
    return `格子 ${match[1]} 已${match[2] === 'blocked' ? '禁用' : '恢复'} · 全部路线已重新规划`;
  }
  if ((match = message.match(/^(JOB-\d+) cancelled$/))) return `${match[1]} 已取消`;
  if ((match = message.match(/^(R-\d+) picked up (S\d+) · (JOB-\d+)$/))) return `${match[1]} 已从 ${match[2]} 取货 · ${match[3]}`;
  if ((match = message.match(/^(JOB-\d+) delivered to (WS-\d+) by (R-\d+)$/))) return `${match[1]} 已由 ${match[3]} 送达 ${match[2]}`;
  if (message.startsWith('Safety stop: ')) return `安全保护已暂停仿真：${translateMessage(message.slice(13))}`;
  return message;
}

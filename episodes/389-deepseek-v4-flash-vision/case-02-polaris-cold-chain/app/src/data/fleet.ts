import type { OpsEvent, RiskKind, Vehicle, VehicleStatus } from '../types'

/* ============================================================
   Map geometry — stylized Yangtze River Delta network
   viewBox: 1600 x 1020
   ============================================================ */

export interface MapNode {
  id: string
  name: string
  x: number
  y: number
  major?: boolean
  sub?: string
}

export const NODES: MapNode[] = [
  { id: 'nantong', name: '南通', x: 330, y: 148, sub: 'NT' },
  { id: 'wuxi', name: '无锡', x: 560, y: 285, sub: 'WX' },
  { id: 'suzhou', name: '苏州', x: 790, y: 362, major: true, sub: 'SZ' },
  { id: 'taicang', name: '太仓', x: 952, y: 300, sub: 'TC' },
  { id: 'kunshan', name: '昆山', x: 936, y: 402, sub: 'KS' },
  { id: 'shanghai', name: '上海', x: 1146, y: 468, major: true, sub: 'SH' },
  { id: 'jiaxing', name: '嘉兴', x: 858, y: 602, sub: 'JX' },
  { id: 'huzhou', name: '湖州', x: 618, y: 592, sub: 'HZ' },
  { id: 'hangzhou', name: '杭州', x: 764, y: 764, major: true, sub: 'HGH' },
  { id: 'shaoxing', name: '绍兴', x: 928, y: 812, sub: 'SX' },
  { id: 'ningbo', name: '宁波', x: 1178, y: 886, major: true, sub: 'NGB' },
  { id: 'zhoushan', name: '舟山', x: 1428, y: 862, sub: 'ZS' },
]

export interface MapEdge {
  a: string
  b: string
  label: string
  tier: 1 | 2
  via?: [number, number][]
}

export const EDGES: MapEdge[] = [
  // G2 京沪 / G42 沪蓉 corridor: 无锡 — 苏州 — 昆山 — 上海
  { a: 'wuxi', b: 'suzhou', label: 'G2', tier: 1 },
  { a: 'suzhou', b: 'kunshan', label: 'G42', tier: 1, via: [[866, 382]] },
  { a: 'kunshan', b: 'shanghai', label: 'G2', tier: 1, via: [[1046, 434]] },
  // G60 沪昆: 上海 — 嘉兴 — 杭州
  { a: 'shanghai', b: 'jiaxing', label: 'G60', tier: 1, via: [[1010, 520], [936, 566]] },
  { a: 'jiaxing', b: 'hangzhou', label: 'G60', tier: 1, via: [[806, 668]] },
  // G15 沈海 + 杭州湾跨海大桥: 上海 — 宁波
  { a: 'shanghai', b: 'ningbo', label: 'G15', tier: 1, via: [[1062, 610], [1052, 736], [1102, 820]] },
  // G92 杭甬: 杭州 — 绍兴 — 宁波
  { a: 'hangzhou', b: 'shaoxing', label: 'G92', tier: 1, via: [[844, 790]] },
  { a: 'shaoxing', b: 'ningbo', label: 'G92', tier: 1, via: [[1060, 856]] },
  // G50 沪渝: 上海 — 湖州
  { a: 'shanghai', b: 'huzhou', label: 'G50', tier: 2, via: [[952, 528], [788, 560]] },
  // G25 长深: 无锡 — 湖州
  { a: 'wuxi', b: 'huzhou', label: 'G25', tier: 2, via: [[556, 440]] },
  // G1522 常台: 苏州 — 嘉兴
  { a: 'suzhou', b: 'jiaxing', label: 'G1522', tier: 2, via: [[824, 484]] },
  // 嘉绍大桥: 嘉兴 — 绍兴
  { a: 'jiaxing', b: 'shaoxing', label: 'G1522', tier: 2, via: [[898, 706]] },
  // 申嘉湖: 嘉兴 — 湖州
  { a: 'jiaxing', b: 'huzhou', label: 'S12', tier: 2, via: [[740, 598]] },
  // 沪苏通大桥: 南通 — 太仓
  { a: 'nantong', b: 'taicang', label: 'G15', tier: 2, via: [[640, 210], [800, 240]] },
  // 通锡: 南通 — 无锡
  { a: 'nantong', b: 'wuxi', label: 'S19', tier: 2, via: [[448, 216]] },
  // 苏州 — 太仓
  { a: 'suzhou', b: 'taicang', label: 'S48', tier: 2, via: [[874, 322]] },
  // 上海 — 太仓
  { a: 'shanghai', b: 'taicang', label: 'G15', tier: 2, via: [[1050, 386]] },
  // 杭州 — 湖州
  { a: 'hangzhou', b: 'huzhou', label: 'S13', tier: 2, via: [[692, 680]] },
  // 宁波 — 舟山
  { a: 'ningbo', b: 'zhoushan', label: 'G9211', tier: 2, via: [[1310, 872]] },
]

/* Vehicle routes: ordered node sequences along the network */
export interface RouteDef {
  id: string
  name: string
  nodes: string[]
}

export const ROUTES: RouteDef[] = [
  { id: 'r-sh-jx-hz', name: '上海 → 杭州', nodes: ['shanghai', 'jiaxing', 'hangzhou'] },
  { id: 'r-wx-sz-sh', name: '无锡 → 上海', nodes: ['wuxi', 'suzhou', 'kunshan', 'shanghai'] },
  { id: 'r-hz-sx-nb', name: '杭州 → 宁波', nodes: ['hangzhou', 'shaoxing', 'ningbo'] },
  { id: 'r-nb-sh', name: '宁波 → 上海', nodes: ['ningbo', 'shanghai'] },
  { id: 'r-sz-jx', name: '苏州 → 嘉兴', nodes: ['suzhou', 'jiaxing'] },
  { id: 'r-sh-hz-2', name: '上海 → 湖州', nodes: ['shanghai', 'huzhou'] },
  { id: 'r-jx-sh', name: '嘉兴 → 上海', nodes: ['jiaxing', 'shanghai'] },
  { id: 'r-nb-sx-hz', name: '宁波 → 杭州', nodes: ['ningbo', 'shaoxing', 'hangzhou'] },
  { id: 'r-wx-hz', name: '无锡 → 湖州', nodes: ['wuxi', 'huzhou'] },
  { id: 'r-sx-jx', name: '绍兴 → 嘉兴', nodes: ['shaoxing', 'jiaxing'] },
]

export const CITY_NAME: Record<string, string> = Object.fromEntries(
  NODES.map((n) => [n.id, n.name]),
)

/* ============================================================
   Fleet — 26 vehicles, 12 on the live map
   ============================================================ */

interface Seed {
  plate: string
  driver: string
  phone: string
  routeId: string
  cargo: string
  batch: string
  weight: string
  tempTarget: number
  temp: number
  status: VehicleStatus
  riskKind: RiskKind
  riskNote: string
  eta: string
  etaOffset: number | null
  progress: number
  onMap: boolean
  speed: number
}

const SEEDS: Seed[] = [
  // --- 12 on-map vehicles ---
  { plate: '沪AD·6832', driver: '陈志远', phone: '138****0965', routeId: 'r-sh-jx-hz', cargo: '三文鱼刺身', batch: 'A-2408-117', weight: '4.2t', tempTarget: 2.0, temp: 7.1, status: 'risk', riskKind: 'temp', riskNote: '厢温 11 分钟由 3.8°C 升至 7.1°C', eta: '04:12', etaOffset: null, progress: 0.31, onMap: true, speed: 78 },
  { plate: '苏E·7K21A', driver: '张海峰', phone: '137****5521', routeId: 'r-wx-sz-sh', cargo: '冷鲜猪肉', batch: 'A-2408-121', weight: '6.8t', tempTarget: 3.0, temp: 2.6, status: 'transit', riskKind: null, riskNote: '', eta: '03:44', etaOffset: null, progress: 0.52, onMap: true, speed: 84 },
  { plate: '浙A·9F302', driver: '李卫东', phone: '139****3318', routeId: 'r-hz-sx-nb', cargo: '车厘子', batch: 'A-2408-109', weight: '5.1t', tempTarget: 1.0, temp: 0.8, status: 'transit', riskKind: null, riskNote: '', eta: '05:02', etaOffset: null, progress: 0.44, onMap: true, speed: 88 },
  { plate: '浙B·8D17M', driver: '赵春林', phone: '136****7740', routeId: 'r-nb-sh', cargo: '冻虾仁', batch: 'A-2408-126', weight: '7.4t', tempTarget: -18.0, temp: -17.8, status: 'risk', riskKind: 'temp', riskNote: '冷冻厢 -17.8°C，低于下限阈值 9 分钟', eta: '03:58', etaOffset: null, progress: 0.63, onMap: true, speed: 76 },
  { plate: '苏U·2H56B', driver: '孙国平', phone: '135****2217', routeId: 'r-sz-jx', cargo: '鲜牛奶', batch: 'A-2408-130', weight: '3.6t', tempTarget: 4.0, temp: 3.9, status: 'transit', riskKind: null, riskNote: '', eta: '02:52', etaOffset: null, progress: 0.71, onMap: true, speed: 66 },
  { plate: '沪C·1P9X4', driver: '周文斌', phone: '138****6643', routeId: 'r-sh-hz-2', cargo: '蓝莓', batch: 'A-2408-133', weight: '2.1t', tempTarget: 1.0, temp: 1.2, status: 'transit', riskKind: null, riskNote: '', eta: '04:26', etaOffset: null, progress: 0.22, onMap: true, speed: 72 },
  { plate: '浙F·6Q83R', driver: '吴建军', phone: '137****9012', routeId: 'r-jx-sh', cargo: '冷鲜牛肉', batch: 'A-2408-136', weight: '5.9t', tempTarget: 3.0, temp: 3.1, status: 'loading', riskKind: 'sla', riskNote: '嘉兴南仓 Dock 07 装卸等待超 SLA 14 分钟', eta: '05:20', etaOffset: 14, progress: 0.03, onMap: true, speed: 0 },
  { plate: '苏E·4N72D', driver: '郑晓东', phone: '139****8845', routeId: 'r-wx-sz-sh', cargo: '冰淇淋', batch: 'A-2408-140', weight: '4.4t', tempTarget: -22.0, temp: -21.6, status: 'risk', riskKind: 'temp', riskNote: '厢温波动幅度超 1.5°C / 10min', eta: '03:36', etaOffset: null, progress: 0.18, onMap: true, speed: 80 },
  { plate: '沪D·7T31Y', driver: '冯立群', phone: '136****4186', routeId: 'r-sh-jx-hz', cargo: '牛排', batch: 'A-2408-142', weight: '3.3t', tempTarget: -18.0, temp: -18.2, status: 'delayed', riskKind: 'delay', riskNote: 'G60 拥堵，预计延误 26 分钟', eta: '04:38', etaOffset: 26, progress: 0.08, onMap: true, speed: 42 },
  { plate: '浙B·3L50C', driver: '何向阳', phone: '135****7503', routeId: 'r-nb-sx-hz', cargo: '冻榴莲', batch: 'A-2408-145', weight: '5.6t', tempTarget: -18.0, temp: -17.9, status: 'transit', riskKind: null, riskNote: '', eta: '04:54', etaOffset: null, progress: 0.36, onMap: true, speed: 82 },
  { plate: '苏B·0W88P', driver: '马跃进', phone: '138****3327', routeId: 'r-wx-hz', cargo: '活菌酸奶', batch: 'A-2408-148', weight: '2.8t', tempTarget: 4.0, temp: 3.8, status: 'transit', riskKind: null, riskNote: '', eta: '03:12', etaOffset: null, progress: 0.55, onMap: true, speed: 64 },
  { plate: '浙D·2M66K', driver: '秦晓峰', phone: '137****6680', routeId: 'r-sx-jx', cargo: '速冻水饺', batch: 'A-2408-150', weight: '6.2t', tempTarget: -18.0, temp: -18.1, status: 'transit', riskKind: null, riskNote: '', eta: '03:26', etaOffset: null, progress: 0.47, onMap: true, speed: 70 },
  // --- off-map vehicles (table only) ---
  { plate: '苏E·9T42C', driver: '蒋永康', phone: '139****1174', routeId: 'r-sh-jx-hz', cargo: '冷鲜鸡', batch: 'A-2408-152', weight: '5.0t', tempTarget: 3.0, temp: 6.4, status: 'risk', riskKind: 'temp', riskNote: '沪杭高速 117K 处厢温超标', eta: '04:41', etaOffset: null, progress: 0.62, onMap: false, speed: 74 },
  { plate: '浙F·7H89Q', driver: '罗建平', phone: '136****0932', routeId: 'r-jx-sh', cargo: '乳制品', batch: 'A-2408-155', weight: '3.9t', tempTarget: 4.0, temp: 4.1, status: 'delayed', riskKind: 'delay', riskNote: '申嘉湖高速改道，ETA 更新 +22 分钟', eta: '05:06', etaOffset: 22, progress: 0.4, onMap: false, speed: 48 },
  { plate: '沪A·5D3F8', driver: '韩卫民', phone: '138****5529', routeId: 'r-nb-sh', cargo: '冻带鱼', batch: 'A-2408-158', weight: '7.1t', tempTarget: -18.0, temp: -17.9, status: 'loading', riskKind: 'sla', riskNote: '宁波北仓 Dock 02 待装卸 28 分钟', eta: '05:44', etaOffset: 28, progress: 0.02, onMap: false, speed: 0 },
  { plate: '沪B·2K55Z', driver: '梁国庆', phone: '135****4408', routeId: 'r-sh-hz-2', cargo: '进口车厘子', batch: 'A-2408-161', weight: '4.6t', tempTarget: 1.0, temp: 2.8, status: 'risk', riskKind: 'temp', riskNote: 'G50 上海段厢温波动，复测中', eta: '04:15', etaOffset: null, progress: 0.28, onMap: false, speed: 70 },
  { plate: '浙A·4J06N', driver: '许志刚', phone: '137****8856', routeId: 'r-hz-sx-nb', cargo: '西湖龙井(冷藏)', batch: 'A-2408-164', weight: '1.2t', tempTarget: 6.0, temp: 5.6, status: 'transit', riskKind: null, riskNote: '', eta: '03:50', etaOffset: null, progress: 0.51, onMap: false, speed: 76 },
  { plate: '苏U·8X13Y', driver: '方国栋', phone: '139****2271', routeId: 'r-sz-jx', cargo: '冷鲜羊肉', batch: 'A-2408-167', weight: '4.8t', tempTarget: 3.0, temp: 5.2, status: 'risk', riskKind: 'temp', riskNote: '苏州段温度探头读数异常', eta: '03:08', etaOffset: null, progress: 0.68, onMap: false, speed: 58 },
  { plate: '浙B·6W27G', driver: '沈建华', phone: '138****7734', routeId: 'r-nb-sx-hz', cargo: '冻鲈鱼', batch: 'A-2408-170', weight: '6.0t', tempTarget: -18.0, temp: -16.9, status: 'risk', riskKind: 'temp', riskNote: '冷冻厢温度回升至 -16.9°C', eta: '05:10', etaOffset: null, progress: 0.19, onMap: false, speed: 72 },
  { plate: '沪D·3M59B', driver: '唐立新', phone: '136****9915', routeId: 'r-wx-sz-sh', cargo: '熟食礼盒', batch: 'A-2408-173', weight: '2.4t', tempTarget: 4.0, temp: 3.7, status: 'transit', riskKind: null, riskNote: '', eta: '02:58', etaOffset: null, progress: 0.34, onMap: false, speed: 66 },
  { plate: '浙F·5R71K', driver: '徐振华', phone: '135****6083', routeId: 'r-jx-sh', cargo: '冷冻鸡翅', batch: 'A-2408-176', weight: '6.6t', tempTarget: -18.0, temp: -18.3, status: 'transit', riskKind: null, riskNote: '', eta: '03:32', etaOffset: null, progress: 0.22, onMap: false, speed: 68 },
  { plate: '苏B·7V30P', driver: '黄文杰', phone: '137****3342', routeId: 'r-wx-hz', cargo: '低脂奶', batch: 'A-2408-179', weight: '3.1t', tempTarget: 4.0, temp: 3.9, status: 'delivered', riskKind: null, riskNote: '', eta: '已完成', etaOffset: null, progress: 1, onMap: false, speed: 0 },
  { plate: '沪C·9S45D', driver: '曹国华', phone: '139****7856', routeId: 'r-sh-jx-hz', cargo: '车厘子', batch: 'A-2408-182', weight: '5.3t', tempTarget: 1.0, temp: 0.9, status: 'delivered', riskKind: null, riskNote: '', eta: '已完成', etaOffset: null, progress: 1, onMap: false, speed: 0 },
  { plate: '浙A·3M08R', driver: '潘志远', phone: '136****2260', routeId: 'r-hz-sx-nb', cargo: '鲜切花', batch: 'A-2408-185', weight: '1.8t', tempTarget: 8.0, temp: 7.4, status: 'idle', riskKind: null, riskNote: '等待调度指令', eta: '—', etaOffset: null, progress: 0, onMap: false, speed: 0 },
  { plate: '苏E·6X90T', driver: '任建新', phone: '138****9147', routeId: 'r-sz-jx', cargo: '冷鲜鸭', batch: 'A-2408-188', weight: '4.5t', tempTarget: 3.0, temp: 3.2, status: 'idle', riskKind: null, riskNote: '上海南汇冷库待装', eta: '—', etaOffset: null, progress: 0, onMap: false, speed: 0 },
]

function makeHistory(target: number, current: number, risk: boolean): number[] {
  // 12 readings over the last 2 hours; risk vehicles show a recent climb/fall
  const out: number[] = []
  let v = risk ? current + (current > target ? -1.2 : 1.1) : target + (current - target) * 0.5
  for (let i = 0; i < 12; i++) {
    const t = i / 11
    if (risk) {
      v = target + (current - target) * Math.pow(t, 1.7) + Math.sin(t * 5) * 0.25
    } else {
      v = v + (current - v) * 0.22 + Math.sin(i * 1.3) * 0.12
    }
    out.push(Number(v.toFixed(1)))
  }
  out[11] = current
  return out
}

export const VEHICLES: Vehicle[] = SEEDS.map((s, i) => ({
  id: `v-${String(i + 1).padStart(2, '0')}`,
  plate: s.plate,
  driver: s.driver,
  driverPhone: s.phone,
  driverPhoneTel: `13${s.phone.slice(2, 5)}${s.phone.slice(9)}`,
  routeName: ROUTES.find((r) => r.id === s.routeId)?.name ?? '—',
  routeId: s.routeId,
  orderId: `P-240821-${String((((719 - i * 37) % 10000) + 10000) % 10000).padStart(4, '0')}`,
  origin: CITY_NAME[ROUTES.find((r) => r.id === s.routeId)!.nodes[0]],
  dest: CITY_NAME[ROUTES.find((r) => r.id === s.routeId)!.nodes.at(-1)!],
  cargo: s.cargo,
  cargoBatch: s.batch,
  cargoWeight: s.weight,
  tempTarget: s.tempTarget,
  temp: s.temp,
  tempHistory: makeHistory(s.tempTarget, s.temp, s.status === 'risk' && s.riskKind === 'temp'),
  eta: s.eta,
  etaOffset: s.etaOffset,
  status: s.status,
  riskKind: s.riskKind,
  riskNote: s.riskNote,
  progress: s.progress,
  onMap: s.onMap,
  speed: s.speed,
  sealNo: `SL-${String(2408210000 + i * 97).slice(0, 11)}`,
  dispatchAt: i % 3 === 0 ? '23:40' : i % 3 === 1 ? '00:15' : '01:02',
}))

export const MAP_VEHICLES = VEHICLES.filter((v) => v.onMap)

/* ============================================================
   Events
   ============================================================ */

const ev = (
  id: string, kind: OpsEvent['kind'], severity: OpsEvent['severity'], time: string,
  text: string, vehicleId: string | null, orderId: string | null,
  resolved = false,
): OpsEvent => ({ id, kind, severity, time, text, vehicleId, orderId, resolved, resolvedAt: resolved ? 1724200000 : null })

export const EVENTS: OpsEvent[] = [
  ev('e-01', 'temp', 'high', '02:11', '沪AD·6832 冷藏厢温度在 11 分钟内由 3.8°C 升至 7.1°C，已触发二级告警', 'v-01', 'P-240821-0719'),
  ev('e-02', 'delay', 'med', '02:09', 'P-240821-0423 因 G60 松江段拥堵预计延误 26 min，ETA 更新为 04:38', 'v-09', 'P-240821-0423'),
  ev('e-03', 'sla', 'med', '02:06', '嘉兴南仓 Dock 07 装卸等待超过 SLA 14 min，司机已二次签到', 'v-07', 'P-240821-0497'),
  ev('e-04', 'temp', 'high', '01:58', '浙B·8D17M 冷冻厢 -17.8°C，低于下限阈值 -18.0°C 持续 9 min', 'v-04', 'P-240821-0608'),
  ev('e-05', 'temp', 'med', '01:52', '苏E·4N72D 厢温波动幅度 1.7°C / 10min，超过警戒带宽', 'v-08', 'P-240821-0460'),
  ev('e-06', 'delay', 'med', '01:47', 'P-240821-0608 沪杭高速杭州段改道，ETA 由 05:12 更新为 05:38', 'v-04', 'P-240821-0608'),
  ev('e-07', 'sla', 'low', '01:39', '苏州西仓 Dock 03 月台门封感应异常，已通知现场复检', 'v-05', 'P-240821-0571'),
  ev('e-08', 'info', 'low', '01:31', '苏E·7K21A 司机提交电子围栏偏离申请（无锡服务区停靠 42 min）', 'v-02', 'P-240821-0682', true),
  ev('e-09', 'info', 'low', '01:18', '上海浦东北仓 2 号冷机告警已确认，备用机组切换完成', null, null, true),
  ev('e-10', 'temp', 'high', '01:04', '浙F·7H89Q 厢温探头读数异常，已远程下发复检指令', 'v-14', 'P-240821-0238'),
]

/* ============================================================
   Constants — shift, fleet-wide stats
   ============================================================ */

export const FLEET_STATS = {
  total: 191,
  online: 184,
  inTransit: 128,
  onTimeRate: 93.7,
  mileageKm: 18642,
  mileageSeries: [612, 704, 655, 733, 812, 905, 872, 934, 1006, 948, 1012, 962, 897, 931, 986, 1058, 1120, 1086, 1152, 1104, 1062, 988, 924, 801],
}

export const SHIFT = { name: '夜班', range: '20:00—08:00' }

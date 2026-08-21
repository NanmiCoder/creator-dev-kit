export type VehicleStatus = 'transit' | 'risk' | 'delayed' | 'loading' | 'delivered' | 'idle'

export type RiskKind = 'temp' | 'delay' | 'sla' | null

export interface Vehicle {
  id: string
  plate: string
  driver: string
  driverPhone: string
  driverPhoneTel: string
  routeName: string
  routeId: string
  orderId: string
  origin: string
  dest: string
  cargo: string
  cargoBatch: string
  cargoWeight: string
  tempTarget: number
  temp: number
  tempHistory: number[]
  eta: string
  etaOffset: number | null // minutes late (positive) — null = on schedule
  status: VehicleStatus
  riskKind: RiskKind
  riskNote: string
  progress: number // 0..1 along route
  onMap: boolean
  speed: number // km/h
  sealNo: string
  dispatchAt: string
}

export type EventKind = 'temp' | 'delay' | 'sla' | 'info'
export type EventSeverity = 'high' | 'med' | 'low'

export interface OpsEvent {
  id: string
  kind: EventKind
  severity: EventSeverity
  time: string
  text: string
  vehicleId: string | null
  orderId: string | null
  resolved: boolean
  resolvedAt: number | null
}

export type DemoState = 'normal' | 'loading' | 'empty' | 'error'

export type SortKey = 'plate' | 'route' | 'temp' | 'eta' | 'status'
export type StatusFilter = 'all' | VehicleStatus

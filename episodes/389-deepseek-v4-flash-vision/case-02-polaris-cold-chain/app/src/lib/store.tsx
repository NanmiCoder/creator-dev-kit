import {
  createContext, useContext, useEffect, useMemo, useReducer,
  type ReactNode,
} from 'react'
import { EVENTS, VEHICLES } from '../data/fleet'
import type {
  DemoState, EventKind, OpsEvent, SortKey, StatusFilter, Vehicle,
} from '../types'

interface Settings {
  motion: boolean
  hubPulse: boolean
  nightDim: boolean
}

interface StoreState {
  vehicles: Vehicle[]
  events: OpsEvent[]
  selectedId: string | null
  drawerOpen: boolean
  tableOpen: boolean
  search: string
  statusFilter: StatusFilter
  sortKey: SortKey
  sortDir: 1 | -1
  eventKindFilter: EventKind | 'all'
  eventsSheet: boolean
  demoState: DemoState
  navActive: string
  paletteOpen: boolean
  popover: 'settings' | 'report' | null
  settings: Settings
  resolveStamp: number
}

const initial: StoreState = {
  vehicles: VEHICLES,
  events: EVENTS,
  selectedId: null,
  drawerOpen: false,
  tableOpen: true,
  search: '',
  statusFilter: 'all',
  sortKey: 'plate',
  sortDir: 1,
  eventKindFilter: 'all',
  eventsSheet: false,
  demoState: 'normal',
  navActive: 'overview',
  paletteOpen: false,
  popover: null,
  settings: { motion: true, hubPulse: true, nightDim: false },
  resolveStamp: 0,
}

type Action =
  | { type: 'select'; id: string | null; openDrawer?: boolean }
  | { type: 'closeDrawer' }
  | { type: 'tableOpen'; value: boolean }
  | { type: 'search'; value: string }
  | { type: 'statusFilter'; value: StatusFilter }
  | { type: 'sort'; key: SortKey }
  | { type: 'eventKindFilter'; value: EventKind | 'all' }
  | { type: 'eventsSheet'; value: boolean }
  | { type: 'demo'; value: DemoState }
  | { type: 'nav'; value: string }
  | { type: 'palette'; value: boolean }
  | { type: 'popover'; value: StoreState['popover'] }
  | { type: 'settings'; key: keyof Settings; value: boolean }
  | { type: 'resolveVehicle'; id: string }
  | { type: 'resolveEvent'; id: string }

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'select':
      return {
        ...state,
        selectedId: action.id,
        drawerOpen: action.openDrawer === false ? state.drawerOpen : action.id !== null,
        navActive: action.id ? state.navActive : state.navActive,
      }
    case 'closeDrawer':
      return { ...state, drawerOpen: false }
    case 'tableOpen':
      return { ...state, tableOpen: action.value }
    case 'search':
      return { ...state, search: action.value }
    case 'statusFilter':
      return { ...state, statusFilter: action.value }
    case 'sort': {
      if (state.sortKey === action.key) return { ...state, sortDir: state.sortDir === 1 ? -1 : 1 }
      return { ...state, sortKey: action.key, sortDir: 1 }
    }
    case 'eventKindFilter':
      return { ...state, eventKindFilter: action.value }
    case 'eventsSheet':
      return { ...state, eventsSheet: action.value }
    case 'demo':
      return { ...state, demoState: action.value }
    case 'nav':
      return { ...state, navActive: action.value }
    case 'palette':
      return { ...state, paletteOpen: action.value }
    case 'popover':
      return { ...state, popover: action.value }
    case 'settings':
      return {
        ...state,
        settings: { ...state.settings, [action.key]: action.value },
      }
    case 'resolveVehicle': {
      const veh = state.vehicles.find((v) => v.id === action.id)
      if (!veh) return state
      const pending = state.events.filter(
        (e) => e.vehicleId === action.id && !e.resolved && e.kind !== 'info',
      )
      const now = Date.now()
      const events = state.events.map((e) =>
        pending.some((p) => p.id === e.id) ? { ...e, resolved: true, resolvedAt: now } : e,
      )
      const vehicles = state.vehicles.map((v) =>
        v.id === action.id
          ? {
              ...v,
              status: v.status === 'risk' || v.status === 'delayed' || v.status === 'loading'
                ? 'transit'
                : v.status,
              riskKind: null,
              riskNote: '',
              temp: v.tempTarget + (v.tempTarget < 0 ? -0.2 : 0.1),
            }
          : v,
      )
      return { ...state, vehicles, events, resolveStamp: now }
    }
    case 'resolveEvent': {
      const evt = state.events.find((e) => e.id === action.id)
      if (!evt || evt.resolved) return state
      const now = Date.now()
      const events = state.events.map((e) =>
        e.id === action.id ? { ...e, resolved: true, resolvedAt: now } : e,
      )
      let vehicles = state.vehicles
      if (evt.vehicleId) {
        const veh = vehicles.find((v) => v.id === evt.vehicleId)
        const stillPending = events.some(
          (e) => e.vehicleId === evt.vehicleId && !e.resolved && e.kind !== 'info',
        )
        if (veh && !stillPending && (veh.status === 'risk' || veh.status === 'delayed' || veh.status === 'loading')) {
          vehicles = vehicles.map((v) =>
            v.id === evt.vehicleId
              ? {
                  ...v,
                  status: 'transit',
                  riskKind: null,
                  riskNote: '',
                  temp: v.tempTarget + (v.tempTarget < 0 ? -0.2 : 0.1),
                }
              : v,
          )
        }
      }
      return { ...state, vehicles, events, resolveStamp: now }
    }
  }
}

interface StoreApi extends StoreState {
  riskCount: number
  pendingRiskEvents: number
  recentlyResolved: number
  select: (id: string | null, openDrawer?: boolean) => void
  closeDrawer: () => void
  setTableOpen: (v: boolean) => void
  setSearch: (v: string) => void
  setStatusFilter: (v: StatusFilter) => void
  setSort: (k: SortKey) => void
  setEventKindFilter: (v: EventKind | 'all') => void
  setEventsSheet: (v: boolean) => void
  setDemo: (v: DemoState) => void
  setNav: (v: string) => void
  setPalette: (v: boolean) => void
  setPopover: (v: StoreState['popover']) => void
  setSetting: (k: keyof Settings, v: boolean) => void
  resolveVehicle: (id: string) => void
  resolveEvent: (id: string) => void
  exportCsv: () => void
}

const Ctx = createContext<StoreApi | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial)

  /* demo-state auto transitions: loading resolves back to normal */
  useEffect(() => {
    if (state.demoState !== 'loading') return
    const t = setTimeout(() => dispatch({ type: 'demo', value: 'normal' }), 2400)
    return () => clearTimeout(t)
  }, [state.demoState])

  const riskCount = useMemo(
    () => state.vehicles.filter((v) => v.status === 'risk').length,
    [state.vehicles],
  )

  const pendingRiskEvents = useMemo(
    () =>
      state.events.filter(
        (e) => !e.resolved && (e.kind === 'temp' || e.kind === 'delay' || e.kind === 'sla'),
      ).length,
    [state.events],
  )

  const recentlyResolved = useMemo(() => {
    if (!state.resolveStamp) return 0
    const cutoff = Date.now() - 3000
    return state.events.filter(
      (e) => e.resolvedAt !== null && e.resolvedAt >= cutoff,
    ).length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.resolveStamp, state.events])

  const api = useMemo<StoreApi>(() => {
    const select = (id: string | null, openDrawer = true) =>
      dispatch({ type: 'select', id, openDrawer })
    return {
      ...state,
      riskCount,
      pendingRiskEvents,
      recentlyResolved,
      select,
      closeDrawer: () => dispatch({ type: 'closeDrawer' }),
      setTableOpen: (value) => dispatch({ type: 'tableOpen', value }),
      setSearch: (value) => dispatch({ type: 'search', value }),
      setStatusFilter: (value) => dispatch({ type: 'statusFilter', value }),
      setSort: (key) => dispatch({ type: 'sort', key }),
      setEventKindFilter: (value) => dispatch({ type: 'eventKindFilter', value }),
      setEventsSheet: (value) => dispatch({ type: 'eventsSheet', value }),
      setDemo: (value) => dispatch({ type: 'demo', value }),
      setNav: (value) => dispatch({ type: 'nav', value }),
      setPalette: (value) => dispatch({ type: 'palette', value }),
      setPopover: (value) => dispatch({ type: 'popover', value }),
      setSetting: (key, value) => dispatch({ type: 'settings', key, value }),
      resolveVehicle: (id) => dispatch({ type: 'resolveVehicle', id }),
      resolveEvent: (id) => dispatch({ type: 'resolveEvent', id }),
      exportCsv: () => exportCsv(state.vehicles),
    }
  }, [state, riskCount, pendingRiskEvents, recentlyResolved])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useStore(): StoreApi {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore outside provider')
  return ctx
}

function exportCsv(vehicles: Vehicle[]) {
  const head = ['车辆', '司机', '路线', '货物', '批号', '温度(°C)', '目标(°C)', 'ETA', '状态']
  const rows = vehicles.map((v) => [
    v.plate, v.driver, v.routeName, v.cargo, v.cargoBatch,
    v.temp.toFixed(1), v.tempTarget.toFixed(1), v.eta, v.status,
  ])
  const csv = [head, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `polaris-fleet-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

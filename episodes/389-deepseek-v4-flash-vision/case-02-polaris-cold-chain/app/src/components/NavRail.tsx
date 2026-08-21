import { useStore } from '../lib/store'
import {
  IconAlert, IconFleet, IconOrder, IconOverview, IconReport, IconSettings, IconTemp,
} from './Icon'

const ITEMS = [
  { id: 'overview', label: '总览', icon: IconOverview },
  { id: 'fleet', label: '车队', icon: IconFleet },
  { id: 'orders', label: '订单', icon: IconOrder },
  { id: 'temp', label: '温控', icon: IconTemp },
  { id: 'alerts', label: '异常', icon: IconAlert },
  { id: 'report', label: '报表', icon: IconReport },
  { id: 'settings', label: '设置', icon: IconSettings },
]

export function NavRail() {
  const store = useStore()

  const activate = (id: string) => {
    store.setNav(id)
    switch (id) {
      case 'overview':
        store.setSearch('')
        store.setStatusFilter('all')
        store.setEventKindFilter('all')
        store.select(null)
        break
      case 'fleet':
        store.setTableOpen(true)
        break
      case 'orders':
        store.setPalette(true)
        break
      case 'temp':
        store.setEventKindFilter('temp')
        store.setStatusFilter('risk')
        store.setTableOpen(true)
        break
      case 'alerts':
        store.setEventKindFilter('all')
        store.setStatusFilter('risk')
        store.select(null)
        break
      case 'report':
        store.setPopover('report')
        break
      case 'settings':
        store.setPopover('settings')
        break
    }
  }

  return (
    <nav className="rail" aria-label="主导航">
      <div className="rail-brand" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2.5 21.5 12 12 21.5 2.5 12Z" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
        </svg>
      </div>
      {ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className="rail-item"
          data-active={store.navActive === id}
          onClick={() => activate(id)}
          aria-label={label}
          title={label}
        >
          <Icon size={17} />
          <span className="rail-label">{label}</span>
        </button>
      ))}
      <div className="rail-foot">
        <span className="rail-clock">POLARIS · OPS</span>
      </div>
    </nav>
  )
}

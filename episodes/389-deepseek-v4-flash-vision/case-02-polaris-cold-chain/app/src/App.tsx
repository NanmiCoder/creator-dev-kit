import { useEffect } from 'react'
import { CommandPalette } from './components/CommandPalette'
import { EventStream, EventsToggle } from './components/EventStream'
import { FleetTable } from './components/FleetTable'
import { KpiPanel } from './components/KpiPanel'
import { MapCanvas } from './components/MapCanvas'
import { NavRail } from './components/NavRail'
import { Popover } from './components/Popover'
import { TopBar } from './components/TopBar'
import { VehicleDrawer } from './components/VehicleDrawer'
import { StoreProvider, useStore } from './lib/store'

function DemoStateCtl() {
  const store = useStore()
  const opts = [
    { id: 'normal', label: '正常' },
    { id: 'loading', label: '加载中' },
    { id: 'empty', label: '空数据' },
    { id: 'error', label: '接口错误' },
  ] as const
  return (
    <div className="demo-ctl" role="group" aria-label="演示状态切换">
      <span className="demo-ctl-tag">DEMO STATE</span>
      {opts.map((o) => (
        <button
          key={o.id}
          data-active={store.demoState === o.id}
          aria-pressed={store.demoState === o.id}
          onClick={() => store.setDemo(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Shell() {
  const store = useStore()

  /* global keyboard: Cmd/Ctrl+K, `/`, Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const typing =
        !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        store.setPalette(!store.paletteOpen)
        return
      }
      if (e.key === '/' && !typing) {
        e.preventDefault()
        store.setPalette(true)
        return
      }
      if (e.key === 'Escape') {
        if (store.paletteOpen) store.setPalette(false)
        else if (store.drawerOpen) store.closeDrawer()
        else if (store.popover) store.setPopover(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [store])

  /* empty / error demo states clear the selection */
  useEffect(() => {
    if (store.demoState === 'empty' || store.demoState === 'error') store.select(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.demoState])

  /* on small screens the fleet list starts collapsed */
  useEffect(() => {
    if (window.matchMedia('(max-width: 920px)').matches) store.setTableOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="app" data-dim={store.settings.nightDim}>
      <NavRail />
      <TopBar />
      <main className="stage-wrap">
        <MapCanvas />
        <KpiPanel />
        <EventStream />
        <EventsToggle />
        <FleetTable />
        <DemoStateCtl />
        <Popover />
        <VehicleDrawer />
      </main>
      <CommandPalette />
      <div className="overlay-noise" aria-hidden="true" />
      <div className="overlay-vignette" aria-hidden="true" />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}

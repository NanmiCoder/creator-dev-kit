import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Orchestrator } from './components/Orchestrator'
import { Channels } from './components/Channels'
import { DataModel } from './components/DataModel'
import { Consistency } from './components/Consistency'
import { Toolbox } from './components/Toolbox'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="grain relative">
      <Nav />
      <main>
        <Hero />
        <Orchestrator />
        <Channels />
        <DataModel />
        <Consistency />
        <Toolbox />
      </main>
      <Footer />
    </div>
  )
}

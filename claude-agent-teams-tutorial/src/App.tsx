import { useKeyboardNav } from './hooks/useKeyboardNav.ts'
import Header from './components/Header.tsx'
import Sidebar from './components/Sidebar.tsx'
import MainContent from './components/MainContent.tsx'

export default function App() {
  useKeyboardNav()

  return (
    <div className="grid grid-cols-1 grid-rows-[auto_auto_1fr] h-screen bg-bg-200 md:grid-cols-[260px_1fr] md:grid-rows-[auto_1fr]">
      <Header />
      <Sidebar />
      <MainContent />
    </div>
  )
}

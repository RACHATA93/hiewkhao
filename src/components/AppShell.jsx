import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="brand-kicker">กินอะไรดีวันนี้</p>
          <h1 className="brand">หิวข้าว</h1>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

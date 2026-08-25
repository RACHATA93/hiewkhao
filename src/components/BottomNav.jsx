import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'หน้าแรก', icon: '🍜', end: true },
  { to: '/map', label: 'แผนที่', icon: '🗺️' },
  { to: '/random', label: 'สุ่มเมนู', icon: '🎲' },
  { to: '/favorites', label: 'ติดดาว', icon: '⭐' },
  { to: '/settings', label: 'ตั้งค่า', icon: '⚙️' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="เมนูหลัก">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            isActive ? 'nav-item is-active' : 'nav-item'
          }
        >
          <span className="nav-icon" aria-hidden>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

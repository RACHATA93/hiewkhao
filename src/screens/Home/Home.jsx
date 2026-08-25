import { Link } from 'react-router-dom'
import RestaurantCard from '../../components/RestaurantCard'
import { useApp } from '../../hooks/useApp'

export default function Home() {
  const { location, restaurants, favorites } = useApp()
  const { nearby } = restaurants

  return (
    <div className="page">
      <section className="hero-card">
        <p className="hero-emoji" aria-hidden>
          📍
        </p>
        {location.loading && <p className="muted">กำลังขอตำแหน่งจริง…</p>}
        {location.coords && (
          <>
            <h2>ร้านรอบตัวคุณ</h2>
            <p className="muted">
              {location.source === 'gps'
                ? 'ใช้ตำแหน่งปัจจุบัน'
                : 'ใช้จุดตัวอย่างที่สยามสแควร์'}
              {location.error ? ` · ${location.error}` : ''}
            </p>
            <p className="stat">
              พบ <strong>{nearby.length}</strong> ร้านในรัศมีที่ตั้งไว้
            </p>
          </>
        )}
        <div className="row-actions">
          <Link className="btn btn-primary" to="/random">
            🎲 วันนี้กินอะไรดี?
          </Link>
          <Link className="btn btn-ghost" to="/map">
            🗺️ ดูแผนที่
          </Link>
        </div>
      </section>

      {!nearby.length && !location.loading && (
        <p className="empty">ยังไม่มีร้านในรัศมีนี้ ลองขยายรัศมีที่ตั้งค่า</p>
      )}

      <ul className="place-list">
        {nearby.map((place) => (
          <li key={place.id}>
            <RestaurantCard
              place={place}
              isFavorite={favorites.isFavorite(place.id)}
              onToggleFavorite={favorites.toggle}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

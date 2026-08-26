import { Link } from 'react-router-dom'
import RestaurantCard from '../../components/RestaurantCard'
import { foodCategories } from '../../data/foodCatalog'
import { useApp } from '../../hooks/useApp'

export default function Home() {
  const { location, restaurants, favorites, radiusKm } = useApp()
  const {
    filtered,
    nearby,
    loading,
    error,
    refresh,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = restaurants

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="hero-card">
        <div className="live-status-bar">
          <span className="live-dot" />
          <span className="live-text">ข้อมูลสดจากแผนที่จริง (OpenStreetMap & Google Maps)</span>
        </div>

        <p className="hero-emoji" aria-hidden>
          🍜
        </p>

        <h2>ร้านอาหารรอบตัวคุณ</h2>
        <p className="muted location-summary">
          📍 {location.locationName}
          {location.source === 'gps' && ' (GPS จริง)'}
        </p>

        <p className="stat">
          พบ <strong>{nearby.length}</strong> ร้านอาหารจริงในรัศมี {radiusKm < 1 ? `${radiusKm * 1000} ม.` : `${radiusKm} กม.`}
        </p>

        <div className="row-actions">
          <Link className="btn btn-primary" to="/random">
            🎲 วันนี้กินอะไรดี?
          </Link>
          <Link className="btn btn-ghost" to="/map">
            🗺️ ดูบนแผนที่ ({nearby.length})
          </Link>
          <button
            type="button"
            className="btn btn-outline-refresh"
            onClick={() => refresh()}
            disabled={loading}
            title="ดึงข้อมูลร้านสดใหม่รอบตัวคุณ"
          >
            {loading ? '⏳ กำลังดึงข้อมูล…' : '🔄 รีเฟรชข้อมูล'}
          </button>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="filter-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหาชื่อร้าน, เมนู (เช่น กะเพรา, ส้มตำ, ชาบู)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="category-scroll">
          {foodCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-pill ${selectedCategory === cat.id ? 'is-active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Error state */}
      {error && (
        <div className="error-card">
          <p>⚠️ {error}</p>
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => refresh()}>
            ลองใหม่อีกครั้ง
          </button>
        </div>
      )}

      {/* Loading state skeleton */}
      {loading && !filtered.length && (
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="muted">กำลังค้นหาร้านอาหารจริงรอบพิกัดของคุณ…</p>
        </div>
      )}

      {/* Results Header */}
      {!loading && (
        <div className="results-header">
          <span className="results-count">
            แสดง <strong>{filtered.length}</strong> ร้าน
            {selectedCategory !== 'all' && ' (กรองตามหมวดหมู่)'}
            {searchQuery && ` (ค้นหา "${searchQuery}")`}
          </span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !filtered.length && !error && (
        <div className="empty-state">
          <p className="empty-icon">🍽️</p>
          <h3>ไม่พบร้านอาหารในเงื่อนไขนี้</h3>
          <p className="muted">
            {searchQuery
              ? `ไม่พบร้านที่ตรงกับ "${searchQuery}" ลองค้นหาด้วยคำอื่น`
              : 'ลองเพิ่มรัศมีการค้นหาที่เมนูตั้งค่า หรือเปลี่ยนหมวดหมู่อาหาร'}
          </p>
          {searchQuery && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            >
              ล้างการค้นหาทั้งหมด
            </button>
          )}
        </div>
      )}

      {/* Place List */}
      <ul className="place-list">
        {filtered.map((place) => (
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

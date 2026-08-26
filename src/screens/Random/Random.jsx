import RestaurantCard from '../../components/RestaurantCard'
import { foodCategories } from '../../data/foodCatalog'
import { useApp } from '../../hooks/useApp'
import { useRandomFood } from '../../hooks/useRandomFood'

export default function Random() {
  const { restaurants, favorites, location } = useApp()
  const {
    picked,
    spinning,
    spin,
    randomCategory,
    setRandomCategory,
    available,
  } = useRandomFood(restaurants.nearby)

  const matches = picked ? restaurants.byFood(picked.id) : []

  return (
    <div className="page">
      {/* Random Hero */}
      <section className="hero-card random-hero">
        <p className="kicker">
          🎲 สุ่มจากเมนูอาหารจริงที่มีร้านเปิดอยู่ใกล้คุณ ({location.locationName})
        </p>

        {/* Category filter for randomizer */}
        <div className="random-category-bar">
          <label htmlFor="random-cat-select" className="random-cat-label">
            สุ่มหมวด:
          </label>
          <select
            id="random-cat-select"
            className="random-cat-select"
            value={randomCategory}
            onChange={(e) => setRandomCategory(e.target.value)}
            disabled={spinning}
          >
            {foodCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Food roulette display stage */}
        <div className={`food-stage ${spinning ? 'is-spinning' : ''}`}>
          {picked ? (
            <>
              <p className="food-emoji" aria-hidden>{picked.emoji}</p>
              <h2 className="food-name">{picked.name}</h2>
              <p className="food-hint">{picked.hint}</p>
            </>
          ) : (
            <>
              <p className="food-emoji" aria-hidden>🎲</p>
              <h2 className="food-name">วันนี้กินอะไรดี?</h2>
              <p className="muted">
                มี {available.length} เมนูเด็ดจากร้านจริงรอบตัวคุณพร้อมให้สุ่ม!
              </p>
            </>
          )}
        </div>

        <div className="random-actions">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={spin}
            disabled={spinning}
          >
            {spinning ? '🌀 กำลังหมุนสุ่ม…' : picked ? '🎲 สุ่มเมนูอื่น' : '🎲 เริ่มสุ่มเมนู'}
          </button>
        </div>
      </section>

      {/* Matched Real Restaurants */}
      {picked && (
        <section className="matches-section">
          <div className="section-header">
            <h3 className="section-title">
              🏪 ร้านอาหารจริงรอบตัวที่ขาย "{picked.name}" ({matches.length} ร้าน)
            </h3>
            <p className="muted section-desc">
              จัดเรียงตามระยะทางที่ใกล้คุณที่สุด สามารถกดนำทางด้วย Google Maps ได้ทันที
            </p>
          </div>

          {!matches.length && (
            <div className="empty-state">
              <p className="empty-icon">📍</p>
              <p className="muted">
                ไม่พบร้านที่เจาะจงเมนูนี้ในรัศมีใกล้ๆ ลองขยายรัศมีการค้นหาที่หน้าตั้งค่า
              </p>
            </div>
          )}

          <ul className="place-list">
            {matches.map((place) => (
              <li key={place.id}>
                <RestaurantCard
                  place={place}
                  highlighted
                  isFavorite={favorites.isFavorite(place.id)}
                  onToggleFavorite={favorites.toggle}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

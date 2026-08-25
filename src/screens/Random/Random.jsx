import RestaurantCard from '../../components/RestaurantCard'
import { useApp } from '../../hooks/useApp'
import { useRandomFood } from '../../hooks/useRandomFood'

export default function Random() {
  const { restaurants, favorites } = useApp()
  const { picked, spinning, spin } = useRandomFood(restaurants.nearby)
  const matches = picked ? restaurants.byFood(picked.id) : []

  return (
    <div className="page">
      <section className="hero-card random-hero">
        <p className="kicker">สุ่มจากเมนูที่มีร้านใกล้คุณ</p>
        <div className={`food-stage ${spinning ? 'is-spinning' : ''}`}>
          {picked ? (
            <>
              <p className="food-emoji">{picked.emoji}</p>
              <h2>{picked.name}</h2>
              <p className="muted">{picked.hint}</p>
            </>
          ) : (
            <>
              <p className="food-emoji">🎲</p>
              <h2>วันนี้กินอะไรดี?</h2>
              <p className="muted">กดสุ่มแล้วไปร้านที่มีเมนูนั้น</p>
            </>
          )}
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={spin}
          disabled={spinning}
        >
          {spinning ? 'กำลังสุ่ม…' : picked ? 'สุ่มใหม่' : 'สุ่มเมนู'}
        </button>
      </section>

      {picked && (
        <section>
          <h3 className="section-title">🏪 ร้านที่มี{picked.name}</h3>
          {!matches.length && (
            <p className="empty">ยังไม่มีร้านเมนูนี้ในรัศมี — ลองขยายรัศมี</p>
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

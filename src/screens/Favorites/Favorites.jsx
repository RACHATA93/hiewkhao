import RestaurantCard from '../../components/RestaurantCard'
import { useApp } from '../../hooks/useApp'

export default function Favorites() {
  const { restaurants, favorites } = useApp()
  const places = restaurants.all.filter((place) =>
    favorites.ids.includes(place.id)
  )

  return (
    <div className="page">
      <section className="favorites-header">
        <h2>⭐ ร้านอาหารที่ติดดาวไว้</h2>
        <p className="muted">
          บันทึกไว้ในอุปกรณ์ของคุณ ({places.length} ร้าน) สามารถกดนำทางผ่าน Google Maps ได้ตลอดเวลา
        </p>
      </section>

      {!places.length && (
        <div className="empty-state">
          <p className="empty-icon">⭐</p>
          <h3>ยังไม่มีร้านที่ติดดาว</h3>
          <p className="muted">
            กดที่ไอคอน ☆ บนการ์ดร้านอาหารที่คุณชอบเพื่อบันทึกไว้ดูภายหลัง
          </p>
        </div>
      )}

      <ul className="place-list">
        {places.map((place) => (
          <li key={place.id}>
            <RestaurantCard
              place={place}
              isFavorite
              onToggleFavorite={favorites.toggle}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

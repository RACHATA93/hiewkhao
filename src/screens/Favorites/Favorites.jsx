import RestaurantCard from '../../components/RestaurantCard'
import { useApp } from '../../hooks/useApp'

export default function Favorites() {
  const { restaurants, favorites } = useApp()
  const places = restaurants.all.filter((place) =>
    favorites.ids.includes(place.id),
  )

  return (
    <div className="page">
      <h2>ร้านที่ติดดาว</h2>
      <p className="muted">เก็บไว้ในเครื่องนี้เท่านั้น ยังไม่มีบัญชีผู้ใช้</p>
      {!places.length && (
        <p className="empty">ยังไม่มีร้านติดดาว — กด ☆ จากหน้าร้านได้เลย</p>
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

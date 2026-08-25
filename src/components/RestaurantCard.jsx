import { mapsDirectionsUrl } from '../utils/distance'

export default function RestaurantCard({
  place,
  highlighted,
  isFavorite,
  onToggleFavorite,
}) {
  return (
    <article className={`place-card ${highlighted ? 'is-highlight' : ''}`}>
      <div className="place-card-top">
        <div>
          <h3>{place.name}</h3>
          <p className="muted">
            {place.distanceLabel} · {place.price} · {place.open}
          </p>
          <p className="muted">{place.address}</p>
        </div>
        <button
          type="button"
          className={`star-btn ${isFavorite ? 'is-on' : ''}`}
          aria-label={isFavorite ? 'เอาดาวออก' : 'ติดดาว'}
          onClick={() => onToggleFavorite(place.id)}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      <div className="menu-chips">
        {place.menuItems.map((food) => (
          <span key={food.id} className="chip">
            {food.emoji} {food.name}
          </span>
        ))}
      </div>
      <a
        className="btn btn-ghost"
        href={mapsDirectionsUrl(place.lat, place.lng)}
        target="_blank"
        rel="noreferrer"
      >
        🧭 นำทาง
      </a>
    </article>
  )
}

export default function RestaurantCard({
  place,
  highlighted,
  isFavorite,
  onToggleFavorite,
}) {
  return (
    <article className={`place-card ${highlighted ? 'is-highlight' : ''}`}>
      <div className="place-card-top">
        <div className="place-info">
          <div className="place-title-row">
            <h3 className="place-name">{place.name}</h3>
            {place.isLive && (
              <span className="live-pill" title="ข้อมูลสถานที่จริงจาก OpenStreetMap & Google Maps">
                📍 พิกัดจริง
              </span>
            )}
          </div>

          <div className="place-meta-line">
            <span className="badge-category">{place.categoryBadge || '🍽️ ร้านอาหาร'}</span>
            <span className="price-tag">{place.price}</span>
            <span className="open-time">⏰ {place.open}</span>
          </div>

          <p className="distance-highlight">
            <strong>{place.distanceLabel}</strong>
            {place.travelEstimate ? ` · ${place.travelEstimate}` : ''}
          </p>

          <p className="address-text">
            📍 {place.address}
            {place.phone && ` · 📞 ${place.phone}`}
          </p>
        </div>

        <button
          type="button"
          className={`star-btn ${isFavorite ? 'is-on' : ''}`}
          aria-label={isFavorite ? 'ลบออกจากรายการโปรด' : 'บันทึกเป็นร้านโปรด'}
          onClick={() => onToggleFavorite(place.id)}
          title={isFavorite ? 'ลบออกจากร้านโปรด' : 'บันทึกเป็นร้านโปรด'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      {place.menuItems && place.menuItems.length > 0 && (
        <div className="menu-section">
          <p className="menu-section-label">🍽️ เมนูที่น่าจะมี / เมนูเด่น:</p>
          <div className="menu-chips">
            {place.menuItems.map((food) => (
              <span key={food.id} className="chip" title={food.hint}>
                {food.emoji} {food.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="place-actions">
        <a
          className="btn btn-primary btn-sm"
          href={place.googleDirectionsUrl}
          target="_blank"
          rel="noreferrer"
          title="เปิด Google Maps เพื่อเริ่มการนำทางทันที"
        >
          🧭 นำทาง (Google Maps)
        </a>
        <a
          className="btn btn-ghost btn-sm"
          href={place.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          title="ดูพิกัด รีวิว และรูปภาพบน Google Maps"
        >
          🔍 ดูบน Maps
        </a>
      </div>
    </article>
  )
}

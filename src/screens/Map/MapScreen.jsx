import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useApp } from '../../hooks/useApp'

const youIcon = L.divIcon({
  className: 'map-pin you-pin',
  html: '<div class="pin-bubble you-bubble">📍</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -32],
})

function getCategoryEmoji(category) {
  switch (category) {
    case 'cafe-dessert': return '☕'
    case 'noodle': return '🍜'
    case 'isan': return '🥗'
    case 'rice-dish': return '🍗'
    case 'japanese-korean': return '🍣'
    case 'shabu-bbq': return '🥩'
    case 'fastfood-western': return '🍔'
    case 'curry': return '🍲'
    default: return '🍛'
  }
}

function createPlaceIcon(category) {
  const emoji = getCategoryEmoji(category)
  return L.divIcon({
    className: 'map-pin shop-pin',
    html: `<div class="pin-bubble shop-bubble">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
  })
}

function Recenter({ coords }) {
  const map = useMap()
  useEffect(() => {
    if (coords && coords.lat && coords.lng) {
      map.setView([coords.lat, coords.lng], 15)
    }
  }, [coords, map])
  return null
}

export default function MapScreen() {
  const { location, restaurants, favorites } = useApp()
  const coords = location.coords
  const { nearby, loading, refresh } = restaurants

  // Cache marker icons per category
  const markerIcons = useMemo(() => {
    const map = new Map()
    const categories = ['all', 'ala-carte', 'noodle', 'isan', 'rice-dish', 'curry', 'shabu-bbq', 'japanese-korean', 'fastfood-western', 'cafe-dessert']
    for (const cat of categories) {
      map.set(cat, createPlaceIcon(cat))
    }
    return map
  }, [])

  if (!coords) {
    return (
      <div className="page center-empty">
        <p className="muted">กำลังรอพิกัดเพื่อแสดงแผนที่…</p>
      </div>
    )
  }

  return (
    <div className="page map-page">
      <div className="map-top-bar">
        <div className="map-meta">
          <span className="map-count">
            📍 <strong>{nearby.length}</strong> ร้านอาหารจริงบนแผนที่
          </span>
          {loading && <span className="map-loading-badge">⏳ กำลังโหลด…</span>}
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-xs"
          onClick={() => refresh()}
          disabled={loading}
        >
          🔄 อัปเดตหมุด
        </button>
      </div>

      <div className="leaflet-wrapper">
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={15}
          className="leaflet-host"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Recenter coords={coords} />

          {/* หมุดตำแหน่งผู้ใช้ */}
          <Marker position={[coords.lat, coords.lng]} icon={youIcon}>
            <Popup className="custom-popup">
              <div className="popup-content">
                <strong>📍 ตำแหน่งของคุณ</strong>
                <p className="muted">{location.locationName}</p>
              </div>
            </Popup>
          </Marker>

          {/* หมุดร้านอาหารจริงรอบตัว */}
          {nearby.map((place) => {
            const icon = markerIcons.get(place.category) || markerIcons.get('all')
            const isFav = favorites.isFavorite(place.id)

            return (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
                icon={icon}
              >
                <Popup className="custom-popup">
                  <div className="popup-content">
                    <h4 className="popup-title">{place.name}</h4>
                    <p className="popup-subtitle">
                      <span className="badge-sm">{place.categoryBadge}</span>
                      <span> · {place.distanceLabel}</span>
                    </p>

                    {place.menuItems && place.menuItems.length > 0 && (
                      <div className="popup-menus">
                        {place.menuItems.slice(0, 3).map((m) => (
                          <span key={m.id} className="chip chip-xs">
                            {m.emoji} {m.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="popup-actions">
                      <a
                        href={place.googleDirectionsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-xs"
                      >
                        🧭 นำทาง
                      </a>
                      <a
                        href={place.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost btn-xs"
                      >
                        🗺️ ดูบน Maps
                      </a>
                      <button
                        type="button"
                        className={`star-mini-btn ${isFav ? 'is-on' : ''}`}
                        onClick={() => favorites.toggle(place.id)}
                        title={isFav ? 'เลิกติดดาว' : 'ติดดาว'}
                      >
                        {isFav ? '★' : '☆'}
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
    </div>
  )
}

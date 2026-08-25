import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { mapsDirectionsUrl } from '../../utils/distance'
import { useApp } from '../../hooks/useApp'

const youIcon = L.divIcon({
  className: 'map-pin you',
  html: '<span>📍</span>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

const shopIcon = L.divIcon({
  className: 'map-pin shop',
  html: '<span>🏪</span>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

function Recenter({ coords }) {
  const map = useMap()
  useEffect(() => {
    map.setView([coords.lat, coords.lng], 16)
  }, [coords, map])
  return null
}

export default function MapScreen() {
  const { location, restaurants, favorites } = useApp()
  const coords = location.coords

  if (!coords) {
    return <p className="page muted">รอตำแหน่งก่อนแสดงแผนที่…</p>
  }

  return (
    <div className="page map-page">
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={16}
        className="leaflet-host"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter coords={coords} />
        <Marker position={[coords.lat, coords.lng]} icon={youIcon}>
          <Popup>คุณอยู่ตรงนี้</Popup>
        </Marker>
        {restaurants.nearby.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={shopIcon}
          >
            <Popup>
              <strong>{place.name}</strong>
              <br />
              {place.distanceLabel}
              <br />
              <button
                type="button"
                onClick={() => favorites.toggle(place.id)}
              >
                {favorites.isFavorite(place.id) ? '★ ติดดาวแล้ว' : '☆ ติดดาว'}
              </button>
              {' · '}
              <a
                href={mapsDirectionsUrl(place.lat, place.lng)}
                target="_blank"
                rel="noreferrer"
              >
                นำทาง
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

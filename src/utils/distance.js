const EARTH_KM = 6371

function toRad(deg) {
  return (deg * Math.PI) / 180
}

export function haversineKm(a, b) {
  if (!a || !b) return Infinity
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

export function offsetLatLng(origin, metersNorth, metersEast) {
  const dLat = metersNorth / 111_320
  const dLng =
    metersEast / (111_320 * Math.cos(toRad(origin.lat)) || 111_320)
  return { lat: origin.lat + dLat, lng: origin.lng + dLng }
}

export function formatDistance(km) {
  if (!Number.isFinite(km)) return '—'
  if (km < 1) return `${Math.round(km * 1000)} ม.`
  return `${km.toFixed(1)} กม.`
}

/**
 * คำนวณเวลาเดินทางโดยประมาณ (เดินเท้าความเร็วเฉลี่ย 4.8 กม./ชม. หรือขับรถหากไกล)
 */
export function formatTravelEstimate(km) {
  if (!Number.isFinite(km)) return ''
  if (km <= 1.2) {
    const minutes = Math.max(1, Math.round((km / 4.8) * 60))
    return `🚶 เดิน ~${minutes} นาที`
  }
  const driveMinutes = Math.max(2, Math.round((km / 25) * 60))
  return `🚗 ขับรถ ~${driveMinutes} นาที`
}

/**
 * สร้างลิงก์นำทางบน Google Maps ที่ถูกต้อง
 */
export function mapsDirectionsUrl(lat, lng, name = '') {
  if (name) {
    const query = encodeURIComponent(name)
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_name=${query}&travelmode=walking`
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`
}

/**
 * สร้างลิงก์ค้นหาร้านหรือเปิดสถานที่บน Google Maps
 */
export function mapsSearchUrl(name, lat, lng, address = '') {
  const cleanName = (name || '').trim()
  const cleanAddr = (address || '').trim()
  const query = encodeURIComponent([cleanName, cleanAddr].filter(Boolean).join(' '))
  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${query || `${lat},${lng}`}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

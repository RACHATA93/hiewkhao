import { formatDistance, formatTravelEstimate, haversineKm, mapsDirectionsUrl, mapsSearchUrl } from '../utils/distance.js'
import { inferRestaurantMenus } from '../utils/menuEngine.js'

// รายชื่อ Overpass API endpoints สำหรับสำรองกรณีเซิร์ฟเวอร์หลักติด Rate Limit หรือช้า
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
]

// แคชผลลัพธ์ในหน่วยความจำชั่วคราวเพื่อลดโหลดการยิงซ้ำ
const memoryCache = new Map()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 นาที

function getCacheKey(lat, lng, radiusKm) {
  return `${lat.toFixed(3)}_${lng.toFixed(3)}_${radiusKm}`
}

/**
 * ดึงข้อมูลร้านอาหารจริงรอบพิกัดที่กำหนดแบบ Real-time จาก OpenStreetMap Overpass API
 */
export async function fetchLiveRestaurants(coords, radiusKm = 1.5, { forceRefresh = false } = {}) {
  if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) {
    return []
  }

  const cacheKey = getCacheKey(coords.lat, coords.lng, radiusKm)
  if (!forceRefresh && memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey)
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data
    }
  }

  const radiusMeters = Math.min(5000, Math.max(300, Math.round(radiusKm * 1000)))
  const query = `[out:json][timeout:15];(node["amenity"~"restaurant|fast_food|cafe|food_court|bistro|pub|ice_cream"](around:${radiusMeters},${coords.lat},${coords.lng});way["amenity"~"restaurant|fast_food|cafe|food_court|bistro|pub|ice_cream"](around:${radiusMeters},${coords.lat},${coords.lng}););out center tags 70;`

  let rawElements = null
  let lastError = null

  // ลองยิงทีละ Endpoint
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 12000)

      const res = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      })
      clearTimeout(timeoutId)

      if (res.ok) {
        const json = await res.json()
        if (json && Array.isArray(json.elements)) {
          rawElements = json.elements
          break
        }
      }
    } catch (err) {
      lastError = err
    }
  }

  // หากดึงไม่ได้หรือไม่มีข้อมูล ให้คืนค่าแคชเก่าหรือ array ว่าง
  if (!rawElements) {
    if (memoryCache.has(cacheKey)) {
      return memoryCache.get(cacheKey).data
    }
    throw new Error(lastError ? `เชื่อมต่อระบบแผนที่สดไม่สำเร็จ (${lastError.message})` : 'ไม่สามารถดึงข้อมูลร้านสดได้ในขณะนี้')
  }

  const formattedPlaces = rawElements
    .map((elem) => {
      const lat = elem.lat ?? elem.center?.lat
      const lng = elem.lon ?? elem.center?.lon
      if (!lat || !lng) return null

      const tags = elem.tags || {}
      const rawName = tags['name:th'] || tags.name || tags['name:en'] || tags.brand

      // ข้ามสถานที่ที่ไม่ระบุชื่อถ้ามีชื่อร้านอื่นมากพอ หรือตั้งชื่อตามประเภท
      const name = rawName ? rawName.trim() : (tags.amenity === 'cafe' ? 'ร้านกาแฟริมทาง' : 'ร้านอาหารริมทาง')

      const km = haversineKm(coords, { lat, lng })
      const addressParts = [
        tags['addr:housenumber'],
        tags['addr:street'] ? `ถ.${tags['addr:street']}` : null,
        tags['addr:suburb'],
        tags['addr:city'] || tags['addr:province'],
      ].filter(Boolean)
      const address = addressParts.length ? addressParts.join(' ') : (tags['addr:street'] ? `ถ.${tags['addr:street']}` : 'ในละแวกนี้')

      const inferred = inferRestaurantMenus({
        name,
        cuisine: tags.cuisine,
        amenity: tags.amenity,
        brand: tags.brand,
        shop: tags.shop,
        opening_hours: tags.opening_hours,
      })

      const googleMapsUrl = mapsSearchUrl(name, lat, lng, address)
      const googleDirectionsUrl = mapsDirectionsUrl(lat, lng, name)

      return {
        id: `osm_${elem.type}_${elem.id}`,
        osmId: elem.id,
        name,
        lat,
        lng,
        km,
        distanceLabel: formatDistance(km),
        travelEstimate: formatTravelEstimate(km),
        address,
        phone: tags.phone || tags['contact:phone'] || null,
        website: tags.website || tags['contact:website'] || null,
        brand: tags.brand || null,
        cuisine: tags.cuisine || null,
        amenity: tags.amenity || 'restaurant',
        category: inferred.category,
        categoryBadge: inferred.categoryBadge,
        menuItems: inferred.menuItems,
        menus: inferred.menuIds,
        price: inferred.price,
        open: inferred.openHours,
        googleMapsUrl,
        googleDirectionsUrl,
        isLive: true,
      }
    })
    .filter(Boolean)
    // กรองชื่อซ้ำในพิกัดใกล้เคียงกัน และเรียงตามระยะทาง
    .filter((place, idx, arr) => arr.findIndex((p) => p.name === place.name && Math.abs(p.km - place.km) < 0.05) === idx)
    .sort((a, b) => a.km - b.km)

  // บันทึกลงแคช
  memoryCache.set(cacheKey, {
    timestamp: Date.now(),
    data: formattedPlaces,
  })

  return formattedPlaces
}

/**
 * ล้างหน่วยความจำแคชทั้งหมด
 */
export function clearRestaurantCache() {
  memoryCache.clear()
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchLiveRestaurants } from '../services/restaurantService'

export function useRestaurants(coords, radiusKm) {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    let cancelled = false

    const execute = async () => {
      if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) {
        if (!cancelled) {
          setPlaces([])
          setLoading(false)
        }
        return
      }

      if (!cancelled) {
        setLoading(true)
        setError(null)
      }

      const forceRefresh = refreshTrigger > 0

      try {
        const results = await fetchLiveRestaurants(coords, radiusKm, { forceRefresh })
        if (!cancelled) {
          setPlaces(results)
          setLastUpdated(new Date())
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลร้านอาหารสด')
          setLoading(false)
        }
      }
    }

    execute()

    return () => {
      cancelled = true
    }
  }, [coords, radiusKm, refreshTrigger])

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  // ร้านทั้งหมดในระยะที่ตั้งไว้ (เรียงตามระยะทาง)
  const nearby = useMemo(() => {
    return places.filter((p) => p.km <= radiusKm)
  }, [places, radiusKm])

  // กรองตามหมวดหมู่และการค้นหา
  const filtered = useMemo(() => {
    let result = nearby

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter((p) => {
        const matchName = p.name.toLowerCase().includes(q)
        const matchAddress = p.address.toLowerCase().includes(q)
        const matchMenu = p.menuItems.some(
          (m) => m.name.toLowerCase().includes(q) || m.hint?.toLowerCase().includes(q)
        )
        return matchName || matchAddress || matchMenu
      })
    }

    return result
  }, [nearby, selectedCategory, searchQuery])

  // ฟังก์ชันค้นหาร้านตามไอดีเมนูอาหาร
  const byFood = useCallback(
    (foodId, { nearbyOnly = true } = {}) => {
      const pool = nearbyOnly ? nearby : places
      return pool.filter((place) => place.menus && place.menus.includes(foodId))
    },
    [nearby, places]
  )

  return {
    all: places,
    nearby,
    filtered,
    loading,
    error,
    lastUpdated,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    refresh,
    byFood,
  }
}

import { useMemo } from 'react'
import { restaurants as catalog } from '../data/restaurants'
import { foods } from '../data/foods'
import { formatDistance, haversineKm, offsetLatLng } from '../utils/distance'

export function useRestaurants(coords, radiusKm) {
  return useMemo(() => {
    if (!coords) {
      return { nearby: [], all: [], byFood: () => [] }
    }

    const all = catalog
      .map((place) => {
        const loc = offsetLatLng(coords, place.north, place.east)
        const km = haversineKm(coords, loc)
        return {
          ...place,
          ...loc,
          km,
          distanceLabel: formatDistance(km),
          menuItems: foods.filter((food) => place.menus.includes(food.id)),
        }
      })
      .sort((a, b) => a.km - b.km)

    const nearby = all.filter((place) => place.km <= radiusKm)

    function byFood(foodId, { nearbyOnly = true } = {}) {
      const pool = nearbyOnly ? nearby : all
      return pool.filter((place) => place.menus.includes(foodId))
    }

    return { nearby, all, byFood }
  }, [coords, radiusKm])
}

import { useCallback, useMemo, useState } from 'react'
import { useFavorites } from '../hooks/useFavorites'
import { useLocation } from '../hooks/useLocation'
import { useRestaurants } from '../hooks/useRestaurants'
import { loadJson, saveJson } from '../utils/storage'
import { AppContext } from './app-context'

export function AppProvider({ children }) {
  const location = useLocation()
  const favorites = useFavorites()
  const [radiusKm, setRadiusKmState] = useState(() => loadJson('radiusKm', 1.5))

  const setRadiusKm = useCallback((km) => {
    setRadiusKmState(km)
    saveJson('radiusKm', km)
  }, [])

  const restaurants = useRestaurants(location.coords, radiusKm)

  const value = useMemo(
    () => ({ location, restaurants, favorites, radiusKm, setRadiusKm }),
    [location, restaurants, favorites, radiusKm, setRadiusKm],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

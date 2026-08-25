import { useCallback, useState } from 'react'
import { loadJson, saveJson } from '../utils/storage'

export function useFavorites() {
  const [ids, setIds] = useState(() => loadJson('favorites', []))

  const persist = useCallback((next) => {
    setIds(next)
    saveJson('favorites', next)
  }, [])

  const isFavorite = useCallback((id) => ids.includes(id), [ids])

  const toggle = useCallback(
    (id) => {
      persist(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])
    },
    [ids, persist],
  )

  const clear = useCallback(() => persist([]), [persist])

  return { ids, isFavorite, toggle, clear }
}

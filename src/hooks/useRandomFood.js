import { useCallback, useMemo, useState } from 'react'
import { foods } from '../data/foods'
import { pickRandom } from '../utils/random'

export function useRandomFood(nearby) {
  const [picked, setPicked] = useState(null)
  const [spinning, setSpinning] = useState(false)

  const available = useMemo(() => {
    const ids = new Set(nearby.flatMap((place) => place.menus))
    const list = foods.filter((food) => ids.has(food.id))
    return list.length ? list : foods
  }, [nearby])

  const spin = useCallback(() => {
    if (spinning) return
    setSpinning(true)
    const frames = 14
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setPicked(available[i % available.length])
      if (i >= frames) {
        clearInterval(timer)
        setPicked(pickRandom(available, picked?.id))
        setSpinning(false)
      }
    }, 70)
  }, [available, picked, spinning])

  return { picked, spinning, available, spin, setPicked }
}

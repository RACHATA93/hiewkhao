import { useCallback, useMemo, useState } from 'react'
import { foodCatalog } from '../data/foodCatalog'
import { pickRandom } from '../utils/random'

export function useRandomFood(nearby = []) {
  const [picked, setPicked] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const [randomCategory, setRandomCategory] = useState('all')

  // รวบรวมเมนูที่มีร้านอาหารจริงในระยะเปิดขาย
  const available = useMemo(() => {
    const menuMap = new Map()

    for (const place of nearby) {
      if (Array.isArray(place.menuItems)) {
        for (const food of place.menuItems) {
          if (!menuMap.has(food.id)) {
            menuMap.set(food.id, food)
          }
        }
      }
    }

    let list = Array.from(menuMap.values())
    if (!list.length) {
      list = foodCatalog
    }

    if (randomCategory !== 'all') {
      const filtered = list.filter((f) => f.category === randomCategory)
      if (filtered.length) return filtered
    }

    return list
  }, [nearby, randomCategory])

  const spin = useCallback(() => {
    if (spinning || !available.length) return
    setSpinning(true)

    // สั่นเตือนเบาๆ บนมือถือถ้าเบราว์เซอร์รองรับ
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([30, 40, 30])
      } catch {
        // ignore
      }
    }

    const frames = 18
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setPicked(available[i % available.length])
      if (i >= frames) {
        clearInterval(timer)
        const finalPick = pickRandom(available, picked?.id) || available[0]
        setPicked(finalPick)
        setSpinning(false)
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate(60)
          } catch {
            // ignore
          }
        }
      }
    }, 65)
  }, [available, picked, spinning])

  return {
    picked,
    spinning,
    available,
    randomCategory,
    setRandomCategory,
    spin,
    setPicked,
  }
}

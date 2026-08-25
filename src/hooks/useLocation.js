import { useCallback, useEffect, useState } from 'react'
import { loadJson, removeJson, saveJson } from '../utils/storage'

export const SIAM_SQUARE = { lat: 13.7462, lng: 100.5347 }

export function useLocation() {
  const [usedSavedDemo] = useState(() => Boolean(loadJson('demo-coords', null)))
  const [coords, setCoords] = useState(
    () => loadJson('demo-coords', null) ?? SIAM_SQUARE,
  )
  const [source, setSource] = useState('demo')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(
    () =>
      !usedSavedDemo &&
      typeof navigator !== 'undefined' &&
      Boolean(navigator.geolocation),
  )

  const applyCoords = useCallback((next, nextSource) => {
    setCoords(next)
    setSource(nextSource)
    setError(null)
    setLoading(false)
    if (nextSource === 'demo') saveJson('demo-coords', next)
    else removeJson('demo-coords')
  }, [])

  const requestGps = useCallback(() => {
    if (!navigator.geolocation) {
      setError('อุปกรณ์นี้ไม่รองรับตำแหน่ง')
      applyCoords(SIAM_SQUARE, 'demo')
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyCoords(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          'gps',
        )
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'ยังไม่ได้เปิดสิทธิ์ตำแหน่ง — ใช้จุดตัวอย่างที่สยามได้'
            : 'หาตำแหน่งไม่สำเร็จ — ใช้จุดตัวอย่างแทน',
        )
        applyCoords(SIAM_SQUARE, 'demo')
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    )
  }, [applyCoords])

  const useDemo = useCallback(() => {
    applyCoords(SIAM_SQUARE, 'demo')
  }, [applyCoords])

  useEffect(() => {
    if (usedSavedDemo || !navigator.geolocation) return undefined
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyCoords(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          'gps',
        )
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'ยังไม่ได้เปิดสิทธิ์ตำแหน่ง — ใช้จุดตัวอย่างที่สยามได้'
            : 'หาตำแหน่งไม่สำเร็จ — ใช้จุดตัวอย่างแทน',
        )
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    )
    return undefined
  }, [applyCoords, usedSavedDemo])

  return { coords, source, error, loading, requestGps, useDemo }
}

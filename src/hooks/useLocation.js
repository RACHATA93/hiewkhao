import { useCallback, useEffect, useState } from 'react'
import { loadJson, removeJson, saveJson } from '../utils/storage'

export const LOCATION_PRESETS = [
  { id: 'siam', name: 'สยามสแควร์ (กรุงเทพฯ)', lat: 13.7462, lng: 100.5347 },
  { id: 'ari', name: 'อารีย์ พหลโยธิน (กรุงเทพฯ)', lat: 13.7797, lng: 100.5448 },
  { id: 'asok', name: 'อโศก / สุขุมวิท (กรุงเทพฯ)', lat: 13.7371, lng: 100.5604 },
  { id: 'yaowarat', name: 'เยาวราช (ไชน่าทาวน์)', lat: 13.7412, lng: 100.5085 },
  { id: 'nimman', name: 'นิมมานเหมินท์ (เชียงใหม่)', lat: 18.7968, lng: 98.9664 },
  { id: 'phuket-town', name: 'เมืองเก่าภูเก็ต', lat: 7.8841, lng: 98.3888 },
]

export const DEFAULT_LOCATION = LOCATION_PRESETS[0]

export function useLocation() {
  const [usedSavedDemo] = useState(() => Boolean(loadJson('demo-coords', null)))
  const [coords, setCoords] = useState(
    () => loadJson('demo-coords', null) ?? { lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng }
  )
  const [locationName, setLocationName] = useState(() => {
    const saved = loadJson('demo-coords', null)
    if (!saved) return DEFAULT_LOCATION.name
    const matched = LOCATION_PRESETS.find((p) => Math.abs(p.lat - saved.lat) < 0.001 && Math.abs(p.lng - saved.lng) < 0.001)
    return matched ? matched.name : 'ตำแหน่งที่เลือก'
  })
  const [source, setSource] = useState(() => (loadJson('demo-coords', null) ? 'preset' : 'demo'))
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(
    () => !usedSavedDemo && typeof navigator !== 'undefined' && Boolean(navigator.geolocation)
  )

  const applyCoords = useCallback((next, nextSource, name = '') => {
    setCoords(next)
    setSource(nextSource)
    setError(null)
    setLoading(false)
    if (name) {
      setLocationName(name)
    } else if (nextSource === 'gps') {
      setLocationName('พิกัด GPS จริงของคุณ')
    }
    if (nextSource !== 'gps') saveJson('demo-coords', next)
    else removeJson('demo-coords')
  }, [])

  const selectPreset = useCallback((preset) => {
    applyCoords({ lat: preset.lat, lng: preset.lng }, 'preset', preset.name)
  }, [applyCoords])

  const requestGps = useCallback(() => {
    if (!navigator.geolocation) {
      setError('อุปกรณ์นี้ไม่รองรับตำแหน่ง GPS')
      applyCoords({ lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng }, 'preset', DEFAULT_LOCATION.name)
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyCoords(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          'gps',
          'พิกัด GPS จริงของคุณ'
        )
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'ยังไม่ได้เปิดสิทธิ์ตำแหน่ง GPS — กำลังใช้ตำแหน่งตัวอย่าง'
            : 'หาตำแหน่ง GPS ไม่สำเร็จ — กำลังใช้ตำแหน่งตัวอย่าง'
        )
        applyCoords({ lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng }, 'preset', DEFAULT_LOCATION.name)
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    )
  }, [applyCoords])

  const useDemo = useCallback(() => {
    selectPreset(DEFAULT_LOCATION)
  }, [selectPreset])

  useEffect(() => {
    if (usedSavedDemo || !navigator.geolocation) return undefined
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyCoords(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          'gps',
          'พิกัด GPS จริงของคุณ'
        )
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'ยังไม่ได้เปิดสิทธิ์ตำแหน่ง GPS — กำลังใช้ตำแหน่งตัวอย่าง'
            : 'หาตำแหน่ง GPS ไม่สำเร็จ — กำลังใช้ตำแหน่งตัวอย่าง'
        )
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    )
    return undefined
  }, [applyCoords, usedSavedDemo])

  return {
    coords,
    source,
    locationName,
    error,
    loading,
    requestGps,
    useDemo,
    selectPreset,
    presets: LOCATION_PRESETS,
  }
}

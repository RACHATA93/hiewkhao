export function pickRandom(list, excludeId) {
  const pool = excludeId ? list.filter((item) => item.id !== excludeId) : list
  const source = pool.length ? pool : list
  if (!source.length) return null
  return source[Math.floor(Math.random() * source.length)]
}

export function shuffle(list) {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

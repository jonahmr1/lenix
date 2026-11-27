import type { SearchTrack } from './search-actions'

export type PriorityTier = number

export function normalizeTiers(ids: string[], tiers: Record<string, number>) {
  const occupied = [...new Set(ids.map(id => tiers[id] ?? 1))].sort(
    (a, b) => a - b
  )
  return Object.fromEntries(
    ids.map(id => [id, occupied.indexOf(tiers[id] ?? 1) + 1])
  )
}

export function moveTrackTier(
  ids: string[],
  tiers: Record<string, number>,
  id: string | string[],
  target: number | 'ascend' | 'descend'
) {
  const selected = Array.isArray(id) ? id : [id]
  const next = normalizeTiers(ids, tiers)
  if (target === 'ascend') {
    for (const track of ids) next[track]++
    for (const track of selected) next[track] = 1
  } else {
    const tier =
      target === 'descend' ? Math.max(...Object.values(next)) + 1 : target
    for (const track of selected) next[track] = tier
  }
  return normalizeTiers(ids, next)
}

export function createPriorityQueue(
  tracks: SearchTrack[],
  playlistId: string,
  tiers: Record<string, PriorityTier>
) {
  const unique = [...new Map(tracks.map(track => [track.id, track])).values()]
  const normalized = normalizeTiers(
    unique.map(track => track.id),
    Object.fromEntries(
      unique.map(track => [track.id, tiers[`${playlistId}:${track.id}`] ?? 1])
    )
  )
  const count = Math.max(0, ...Object.values(normalized))
  const queue: SearchTrack[] = []
  for (let tier = 1; tier <= count; tier++) {
    const group = unique.filter(track => normalized[track.id] === tier)
    for (let pass = 0; pass < count - tier + 1; pass++) {
      const shuffled = [...group]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      queue.push(...shuffled)
    }
  }
  return queue
}

// Both automatic advancement and the Next button use the same cycle boundary.
export function advancePriorityQueue(state: {
  queue: SearchTrack[]
  nextQueue: SearchTrack[]
  queueIndex: number
  queuePlaylistId: string | null
  repeatQueue: boolean
  trackTiers: Record<string, number>
}) {
  const wraps = state.queueIndex + 1 >= state.queue.length
  if (wraps && !state.repeatQueue) return null
  const queue = wraps ? state.nextQueue : state.queue
  const queueIndex = wraps ? 0 : state.queueIndex + 1
  if (!queue[queueIndex]) return null
  return {
    queue,
    queueIndex,
    currentTrack: queue[queueIndex],
    nextQueue: wraps
      ? createPriorityQueue(
          queue,
          state.queuePlaylistId ?? '',
          state.trackTiers
        )
      : state.nextQueue,
  }
}

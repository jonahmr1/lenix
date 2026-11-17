import 'server-only'

import { decode } from 'he'
import type { SearchTrack } from './search-actions'

export async function getTrackDetails(ids: string[]): Promise<SearchTrack[]> {
  if (!ids.length) return []
  const key =
    process.env.YOUTUBE_API_KEY ?? process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  if (!key) throw new Error('YouTube is not configured yet.')
  const tracks = new Map<string, SearchTrack>()
  for (let offset = 0; offset < ids.length; offset += 50) {
    const params = new URLSearchParams({
      key,
      part: 'snippet,contentDetails',
      id: ids.slice(offset, offset + 50).join(','),
    })
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${params}`,
      {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(10000),
      }
    )
    if (!response.ok)
      throw new Error('Couldn’t load playlist tracks. Please try again.')
    const data: {
      items?: {
        id: string
        snippet: { title: string; channelTitle: string }
        contentDetails: { duration: string }
      }[]
    } = await response.json()
    for (const item of data.items ?? []) {
      const match = /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(
        item.contentDetails.duration
      )
      const hours = Number(match?.[1] ?? 0) * 24 + Number(match?.[2] ?? 0)
      const minutes = Number(match?.[3] ?? 0)
      const seconds = Number(match?.[4] ?? 0)
      tracks.set(item.id, {
        id: item.id,
        title: decode(item.snippet.title),
        channel: decode(item.snippet.channelTitle),
        duration: match
          ? `${hours ? `${hours}:${String(minutes).padStart(2, '0')}` : minutes}:${String(seconds).padStart(2, '0')}`
          : '—',
      })
    }
  }
  return ids.map(
    id =>
      tracks.get(id) ?? {
        id,
        title: 'Unavailable track',
        channel: '—',
        duration: '—',
      }
  )
}

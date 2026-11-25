import 'server-only'

import { decode } from 'he'
import type { SearchTrack } from './search-actions'
import { youtubeClient } from './youtube'
import { formatTrackDuration } from './duration'

export async function getTrackDetails(ids: string[]): Promise<SearchTrack[]> {
  if (!ids.length) return []
  const tracks = new Map<string, SearchTrack>()
  for (let offset = 0; offset < ids.length; offset += 50) {
    const { data } = await youtubeClient.videos.list({
      part: ['snippet', 'contentDetails'],
      id: ids.slice(offset, offset + 50),
    })
    for (const item of data.items ?? []) {
      if (!item.id) continue
      tracks.set(item.id, {
        id: item.id,
        title: decode(item.snippet?.title ?? 'Unavailable track'),
        channel: decode(item.snippet?.channelTitle ?? '—'),
        duration: formatTrackDuration(item.contentDetails?.duration),
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

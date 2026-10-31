import 'server-only'

import { decode } from 'he'

export type Track = { id: string; title: string; channel: string }
type Video = {
  id?: string | { videoId?: string }
  snippet?: { title?: string; channelTitle?: string }
}
type YouTubeResponse = { items?: Video[]; nextPageToken?: string }

export function isVideoId(value: unknown): value is string {
  return typeof value === 'string' && /^[\w-]{11}$/.test(value)
}

async function request(
  resource: 'search' | 'videos',
  params: Record<string, string>
) {
  const key = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  if (!key) throw new Error('YouTube search is not configured yet.')
  const url = new URL(`https://www.googleapis.com/youtube/v3/${resource}`)
  url.search = new URLSearchParams({ ...params, key }).toString()
  let response: Response
  try {
    response = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    throw new Error('Couldn’t reach YouTube. Please try again.')
  }
  if (!response.ok) {
    if (response.status === 403 || response.status === 429)
      throw new Error(
        'YouTube is limiting requests right now. Please try again later.'
      )
    throw new Error('Couldn’t load tracks from YouTube. Please try again.')
  }
  return (await response.json()) as YouTubeResponse
}

function tracksFrom(data: YouTubeResponse): Track[] {
  return (data.items ?? []).flatMap(item => {
    const id = typeof item.id === 'string' ? item.id : item.id?.videoId
    if (!isVideoId(id) || !item.snippet?.title) return []
    return [
      {
        id,
        title: decode(item.snippet.title),
        channel: decode(item.snippet.channelTitle ?? ''),
      },
    ]
  })
}

export async function searchTracks(query: string, pageToken = '') {
  const q = query.trim()
  if (!q || q.length > 200 || !/^[\w=-]{0,512}$/.test(pageToken))
    throw new Error('Enter a search of 1–200 characters.')
  const data = await request('search', {
    part: 'snippet',
    type: 'video',
    q,
    maxResults: '20',
    videoCategoryId: '10',
    videoEmbeddable: 'true',
    ...(pageToken ? { pageToken } : {}),
  })
  return { tracks: tracksFrom(data), nextPageToken: data.nextPageToken }
}

export async function readTracks(ids: string[]): Promise<Track[]> {
  const validIds = [...new Set(ids.filter(isVideoId))]
  const tracks: Track[] = []
  for (let start = 0; start < validIds.length; start += 50) {
    tracks.push(
      ...tracksFrom(
        await request('videos', {
          part: 'snippet',
          id: validIds.slice(start, start + 50).join(','),
        })
      )
    )
  }
  const byId = new Map(tracks.map(track => [track.id, track]))
  return ids.map(
    id =>
      byId.get(id) ?? { id, title: 'Unavailable YouTube track', channel: '' }
  )
}

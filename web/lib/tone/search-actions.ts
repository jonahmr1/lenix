'use server'

import { cookies } from 'next/headers'
import { decode } from 'he'
import { createClient } from '@/lib/supabase.server'

export type SearchTrack = {
  id: string
  title: string
  channel: string
  duration: string
}

export async function searchTracks(
  query: string
): Promise<{ tracks: SearchTrack[] } | { error: string }> {
  const q = query.trim()
  if (!q || q.length > 200)
    return { error: 'Enter a search of 1–200 characters.' }
  try {
    const supabase = createClient(await cookies())
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user) return { error: 'Please sign in again to search.' }
    const key =
      process.env.YOUTUBE_API_KEY ?? process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    if (!key) return { error: 'YouTube search is not configured yet.' }
    const params = new URLSearchParams({
      key,
      part: 'snippet',
      type: 'video',
      q,
      maxResults: '20',
      videoCategoryId: '10',
      videoEmbeddable: 'true',
    })
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`,
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(10000) }
    )
    if (!response.ok)
      return { error: 'Couldn’t search YouTube. Please try again later.' }
    const data: {
      items?: {
        id: { videoId?: string }
        snippet: { title: string; channelTitle: string }
      }[]
    } = await response.json()
    const items = (data.items ?? []).filter(
      item => item.id.videoId && /^[\w-]{11}$/.test(item.id.videoId)
    )
    if (!items.length) return { tracks: [] }
    const detailsParams = new URLSearchParams({
      key,
      part: 'contentDetails',
      id: items.map(item => item.id.videoId).join(','),
    })
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${detailsParams}`,
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(10000) }
    )
    if (!detailsResponse.ok)
      return { error: 'Couldn’t load track details. Please try again.' }
    const details: {
      items?: { id: string; contentDetails: { duration: string } }[]
    } = await detailsResponse.json()
    const durations = new Map(
      (details.items ?? []).map(item => {
        const match = /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(
          item.contentDetails.duration
        )
        if (!match) return [item.id, '—']
        const hours = Number(match[1] ?? 0) * 24 + Number(match[2] ?? 0)
        const minutes = Number(match[3] ?? 0)
        const seconds = Number(match[4] ?? 0)
        return [
          item.id,
          `${hours ? `${hours}:${String(minutes).padStart(2, '0')}` : minutes}:${String(seconds).padStart(2, '0')}`,
        ]
      })
    )
    return {
      tracks: items.map(item => ({
        id: item.id.videoId!,
        title: decode(item.snippet.title),
        channel: decode(item.snippet.channelTitle),
        duration: durations.get(item.id.videoId!) ?? '—',
      })),
    }
  } catch {
    return { error: 'Couldn’t reach YouTube. Please try again.' }
  }
}

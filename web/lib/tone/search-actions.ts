'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/supabase/server'
import { youtubeClient, youtubeFailure } from './youtube'
import { getTrackDetails } from './track-details'
import { pageTokenSchema, searchQuerySchema, videoIdSchema } from './validation'

export interface SearchTrack {
  id: string
  title: string
  channel: string
  duration: string
}

export async function searchTracks(
  query: string,
  pageToken = ''
): Promise<
  { tracks: SearchTrack[]; nextPageToken: string | null } | { error: string }
> {
  const parsed = searchQuerySchema.safeParse(query)
  if (!parsed.success) return { error: 'Enter a search query.' }
  if (!pageTokenSchema.safeParse(pageToken).success)
    return { error: 'Invalid search page. Please search again.' }
  try {
    const supabase = createClient(await cookies())
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user) return { error: 'Please sign in again to search.' }
    const { data } = await youtubeClient.search.list({
      part: ['snippet'],
      type: ['video'],
      q: parsed.data,
      maxResults: 50,
      videoCategoryId: '10',
      videoEmbeddable: 'true',
      ...(pageToken ? { pageToken } : {}),
    })
    const ids = (data.items ?? []).flatMap(item => {
      const id = videoIdSchema.safeParse(item.id?.videoId)
      return id.success ? [id.data] : []
    })
    return {
      tracks: await getTrackDetails(ids),
      nextPageToken: data.nextPageToken ?? null,
    }
  } catch (error) {
    const failure = youtubeFailure(error)
    return {
      error:
        failure === 'quota'
          ? 'YouTube’s daily search quota has been reached. Try again after the quota resets.'
          : failure === 'rate'
            ? 'YouTube is limiting search requests. Please try again later.'
            : 'Couldn’t reach YouTube. Please try again.',
    }
  }
}

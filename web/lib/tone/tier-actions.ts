'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase.server'
import { moveTrackTier, normalizeTiers } from './priority-queue'

export async function setTrackTier(
  playlistId: string,
  videoId: string,
  target: number | 'ascend' | 'descend'
) {
  if (
    !/^[\da-f-]{36}$/i.test(playlistId) ||
    !/^[\w-]{11}$/.test(videoId) ||
    (target !== 'ascend' &&
      target !== 'descend' &&
      (!Number.isSafeInteger(target) || target < 1))
  )
    return { error: 'Choose a valid track and tier.' }
  try {
    const supabase = createClient(await cookies())
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user)
      return { error: 'Please sign in again to change tiers.' }
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: playlist, error: readError } = await supabase
        .from('playlists')
        .select('tracks, track_tiers')
        .eq('id', playlistId)
        .eq('user_id', user.id)
        .maybeSingle()
      if (readError) throw readError
      if (!playlist?.tracks.includes(videoId))
        return { error: 'That track is no longer in this playlist.' }
      const tiers = normalizeTiers(
        playlist.tracks,
        playlist.track_tiers as Record<string, number>
      )
      if (
        typeof target === 'number' &&
        target > Math.max(...Object.values(tiers))
      )
        return { error: 'That tier no longer exists. Please try again.' }
      const next = moveTrackTier(playlist.tracks, tiers, videoId, target)
      const { data: updated, error: saveError } = await supabase
        .from('playlists')
        .update({ track_tiers: next })
        .eq('id', playlistId)
        .eq('user_id', user.id)
        .eq('track_tiers', JSON.stringify(playlist.track_tiers))
        .filter(
          'tracks',
          'eq',
          `{${playlist.tracks.map(id => JSON.stringify(id)).join(',')}}`
        )
        .select('id')
        .maybeSingle()
      if (saveError) throw saveError
      if (updated) {
        revalidatePath('/tone', 'layout')
        return { tiers: next }
      }
    }
    return { error: 'The playlist changed while saving. Please try again.' }
  } catch {
    return { error: 'Couldn’t save the tier. Please try again.' }
  }
}

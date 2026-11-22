'use server'

import { normalizeTiers } from './priority-queue'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase.server'

export async function setTrackInPlaylist(
  playlistId: string,
  videoId: string,
  included: boolean
): Promise<{ playlistName: string } | { error: string }> {
  if (
    typeof included !== 'boolean' ||
    typeof playlistId !== 'string' ||
    !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(
      playlistId
    ) ||
    typeof videoId !== 'string' ||
    !/^[a-zA-Z0-9_-]{11}$/.test(videoId)
  )
    return { error: 'Choose a valid track and playlist.' }
  try {
    const supabase = createClient(await cookies())
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user)
      return { error: 'Please sign in again to update tracks.' }

    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: playlist, error } = await supabase
        .from('playlists')
        .select('label, tracks, track_tiers')
        .eq('id', playlistId)
        .eq('user_id', user.id)
        .maybeSingle()
      if (error) throw error
      if (!playlist) return { error: 'That playlist is no longer available.' }
      if (playlist.tracks.includes(videoId) === included)
        return { playlistName: playlist.label }

      // Compare the previous array so another tab's changes cannot be overwritten.
      const previous = `{${playlist.tracks.map(id => JSON.stringify(id)).join(',')}}`
      const { data: updated, error: updateError } = await supabase
        .from('playlists')
        .update({
          track_tiers: normalizeTiers(
            included
              ? [...playlist.tracks, videoId]
              : playlist.tracks.filter(id => id !== videoId),
            playlist.track_tiers as Record<string, number>
          ),
          tracks: included
            ? [...playlist.tracks, videoId]
            : playlist.tracks.filter(id => id !== videoId),
        })
        .eq('id', playlistId)
        .eq('user_id', user.id)
        .filter('tracks', 'eq', previous)
        .eq('track_tiers', JSON.stringify(playlist.track_tiers))
        .select('id')
        .maybeSingle()
      if (updateError) throw updateError
      if (updated) {
        revalidatePath('/tone', 'layout')
        return { playlistName: playlist.label }
      }
    }
    return { error: 'Your playlist changed while saving. Please try again.' }
  } catch {
    return { error: 'Couldn’t update this playlist. Please try again.' }
  }
}

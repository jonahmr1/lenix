'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase.server'
import { isVideoId } from '@/app/tone/youtube'

export async function addTrack(
  playlistId: string,
  videoId: string
): Promise<{ added: boolean; playlistName: string } | { error: string }> {
  if (
    typeof playlistId !== 'string' ||
    !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(
      playlistId
    ) ||
    !isVideoId(videoId)
  )
    return { error: 'Choose a valid track and playlist.' }
  try {
    const supabase = createClient(await cookies())
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user)
      return { error: 'Please sign in again to add tracks.' }

    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: playlist, error } = await supabase
        .from('playlists')
        .select('label, tracks')
        .eq('id', playlistId)
        .eq('user_id', user.id)
        .maybeSingle()
      if (error) throw error
      if (!playlist) return { error: 'That playlist is no longer available.' }
      if (playlist.tracks.includes(videoId))
        return { added: false, playlistName: playlist.label }

      // Compare the previous array so another tab's addition cannot be overwritten.
      const previous = `{${playlist.tracks.map(id => JSON.stringify(id)).join(',')}}`
      const { data: updated, error: updateError } = await supabase
        .from('playlists')
        .update({ tracks: [...playlist.tracks, videoId] })
        .eq('id', playlistId)
        .eq('user_id', user.id)
        .filter('tracks', 'eq', previous)
        .select('id')
        .maybeSingle()
      if (updateError) throw updateError
      if (updated) {
        revalidatePath('/tone', 'layout')
        return { added: true, playlistName: playlist.label }
      }
    }
    return { error: 'Your playlist changed while saving. Please try again.' }
  } catch {
    return { error: 'Couldn’t add this track. Please try again.' }
  }
}

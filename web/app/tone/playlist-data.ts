import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase.types'

export type Playlist = {
  id: string
  label: string
  trackCount: number
}

export async function readPlaylist(
  supabase: SupabaseClient<Database>,
  userId: string,
  playlistId: string
): Promise<Playlist | null> {
  if (
    !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(
      playlistId
    )
  )
    return null

  const { data, error } = await supabase
    .from('playlists')
    .select('id, label, tracks')
    .eq('user_id', userId)
    .eq('id', playlistId)
    .maybeSingle()

  if (error) throw new Error('Couldn’t load this playlist. Please try again.')
  return data
    ? { id: data.id, label: data.label, trackCount: data.tracks?.length ?? 0 }
    : null
}

export async function readPlaylists(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<{ playlists: Playlist[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .select('id, label, tracks')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })

    if (error) throw error
    return {
      playlists: (data ?? []).map(({ id, label, tracks }) => ({
        id,
        label,
        trackCount: tracks?.length ?? 0,
      })),
      error: null,
    }
  } catch {
    return {
      playlists: [],
      error: 'Couldn’t load your playlists. Please try again.',
    }
  }
}

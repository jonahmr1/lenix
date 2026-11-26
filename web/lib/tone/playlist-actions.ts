'use server'

import { playlistNameSchema } from './validation'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/supabase/server'

export async function createPlaylist(
  formData: FormData
): Promise<{ id: string } | { error: string }> {
  const value = formData.get('name')
  const name = typeof value === 'string' ? value.trim() : ''
  if (!playlistNameSchema.safeParse(name).success) {
    return { error: 'Enter a playlist name.' }
  }

  try {
    const supabase = createClient(await cookies())
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user)
      return { error: 'Please sign in again to create a playlist.' }

    const { data, error } = await supabase
      .from('playlists')
      .insert({ label: name, tracks: [], user_id: user.id })
      .select('id')
      .single()

    if (error || !data)
      return { error: 'Couldn’t create your playlist. Please try again.' }

    revalidatePath('/tone', 'layout')
    return { id: data.id }
  } catch {
    return { error: 'Couldn’t create your playlist. Please try again.' }
  }
}

export async function markPlaylistPlayed(id: string) {
  const supabase = createClient(await cookies())
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data, error } = await supabase.from('playlists')
    .update({ last_played_at: new Date().toISOString() })
    .eq('user_id', user.id).eq('id', id).select('id').single()
  return !error && Boolean(data)
}

'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase.server'

export async function createPlaylist(
  formData: FormData
): Promise<{ id: string } | { error: string }> {
  const value = formData.get('name')
  const name = typeof value === 'string' ? value.trim() : ''
  if (!name || name.length > 100) {
    return { error: 'Enter a playlist name between 1 and 100 characters.' }
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

    revalidatePath('/tone')
    return { id: data.id }
  } catch {
    return { error: 'Couldn’t create your playlist. Please try again.' }
  }
}

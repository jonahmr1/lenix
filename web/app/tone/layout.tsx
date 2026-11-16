import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase.server'
import { AppProvider } from './provider'

export default async function ToneLayout({ children }: { children: ReactNode }) {
  const supabase = createClient(await cookies())
  const { data: { user } } = await supabase.auth.getUser()
  const { data: playlists, error } = user
    ? await supabase.from('playlists').select('id, name:label').eq('user_id', user.id).order('created_at')
    : { data: [], error: null }

  if (error) throw new Error('Couldn’t load your playlists. Please refresh to try again.')

  return (
    <AppProvider key={user?.id ?? 'guest'} playlists={playlists ?? []}>
      {children}
    </AppProvider>
  )
}

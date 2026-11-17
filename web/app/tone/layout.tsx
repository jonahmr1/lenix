import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { SignIn } from '@/components/tone/sign-in'
import { createClient } from '@/lib/supabase.server'
import { AppProvider } from './provider'
import { AppShell } from './app-shell'

export default async function ToneLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = createClient(await cookies())
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return <SignIn initialMessage={null} />

  const { data: playlists, error } = await supabase
    .from('playlists')
    .select('id, name:label')
    .eq('user_id', user.id)
    .order('created_at')

  if (error)
    throw new Error(
      'Couldn’t load your playlists. Please refresh to try again.'
    )

  return (
    <AppProvider key={user.id} playlists={playlists ?? []}>
      <AppShell
        account={{
          name: user.user_metadata.full_name || user.email || 'Account',
          email: user.email ?? '',
          avatar: user.user_metadata.avatar_url,
        }}
      >
        {children}
      </AppShell>
    </AppProvider>
  )
}

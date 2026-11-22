import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { SignIn } from '@/components/tone/sign-in'
import { createClient } from '@/lib/supabase.server'
import { AppProvider } from './provider'
import { AppHeader } from '@/components/tone/app-header'
import { PlaylistsSidebar } from '@/components/tone/playlists-sidebar'
import { PlaylistActionDialog } from '@/components/tone/playlist-action-dialog'
import { QueueSidebar } from '@/components/tone/queue-sidebar'
import { Player } from '@/components/tone/player'
import { SidebarInset } from '@/components/ui/sidebar'

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
    .select('id, name:label, tracks')
    .eq('user_id', user.id)
    .order('created_at')

  if (error)
    throw new Error(
      'Couldn’t load your playlists. Please refresh to try again.'
    )

  const { data: savedImport, error: importError } = await supabase
    .from('spotify_imports')
    .select('playlist_url')
    .eq('user_id', user.id)
    .maybeSingle()
  if (importError)
    throw new Error(
      'Couldn’t load saved import progress. Please refresh to try again.'
    )
  return (
    <AppProvider
      key={user.id}
      playlists={playlists ?? []}
      spotifyPlaylistUrl={savedImport?.playlist_url ?? ''}
    >
      <div className='flex min-h-0 flex-1'>
        <PlaylistsSidebar
          account={{
            name: user.user_metadata.full_name || user.email || 'Account',
            email: user.email ?? '',
            avatar: user.user_metadata.avatar_url,
          }}
        />
        <PlaylistActionDialog />
        <SidebarInset className='mx-0 min-h-0 min-w-0 overflow-hidden'>
          <AppHeader />
          <div className='flex min-h-0 flex-1 flex-col overflow-y-auto'>
            {children}
          </div>
        </SidebarInset>
        <QueueSidebar />
      </div>
      <Player />
    </AppProvider>
  )
}

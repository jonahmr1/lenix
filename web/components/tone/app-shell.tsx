'use client'
import Link from 'next/link'
import { MusicNotesIcon, SidebarIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import type { Playlist } from '@/app/tone/playlist-data'
import { AccountMenu } from './account-menu'
import { PlaybackBar } from './playback-bar'
import { PlaylistSidebar } from './playlist-sidebar'
import { QueueSidebar, QueueTrigger } from './queue-sidebar'

type AppShellProps = {
  children: React.ReactNode
  email: string | null
  name: string | null
  avatarUrl: string | null
  playlists: Playlist[]
  playlistError: string | null
}

export function AppShell(props: AppShellProps) {
  return (
    <SidebarProvider
      cookieName="tone_playlists_sidebar"
      className="not-typeset h-dvh min-h-0 bg-background text-foreground"
    >
      <PlaylistShell {...props} />
    </SidebarProvider>
  )
}

function PlaylistShell({
  children,
  email,
  name,
  avatarUrl,
  playlists,
  playlistError,
}: AppShellProps) {
  const { toggleSidebar, open, openMobile, isMobile } = useSidebar()
  return (
    <>
      <PlaylistSidebar playlists={playlists} playlistError={playlistError} />
      <SidebarProvider
        cookieName="tone_queue_sidebar"
        keyboardShortcut={null}
        className="min-h-0 min-w-0 flex-1"
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 flex-wrap items-center gap-y-3 border-b p-4">
            <div className="group/playlists-control flex items-center">
              {!(isMobile ? openMobile : open) && (
                <Button
                  variant="ghost"
                  className="group/toggle mr-3 h-11 w-11 overflow-hidden border-0 p-0 transition-[width,margin,opacity] duration-200 ease-out motion-reduce:transition-none [@media(hover:hover)]:mr-0 [@media(hover:hover)]:w-0 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within/playlists-control:mr-3 [@media(hover:hover)]:group-focus-within/playlists-control:w-11 [@media(hover:hover)]:group-focus-within/playlists-control:opacity-100 [@media(hover:hover)]:group-hover/playlists-control:mr-3 [@media(hover:hover)]:group-hover/playlists-control:w-11 [@media(hover:hover)]:group-hover/playlists-control:opacity-100"
                  aria-label="Toggle playlists"
                  onClick={toggleSidebar}
                >
                  <MusicNotesIcon
                    aria-hidden="true"
                    className="group-hover/toggle:hidden"
                  />
                  <SidebarIcon
                    aria-hidden="true"
                    className="hidden group-hover/toggle:block"
                  />
                </Button>
              )}
              <Link
                href="/tone"
                className="text-2xl font-medium tracking-tight"
              >
                Tonelix
              </Link>
            </div>
            <div className="group/queue-control ml-auto flex items-center pl-3">
              <AccountMenu email={email} name={name} avatarUrl={avatarUrl} />
              <QueueTrigger />
            </div>
          </header>

          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
            {children}
          </main>

          <PlaybackBar />
        </div>
        <QueueSidebar />
      </SidebarProvider>
    </>
  )
}

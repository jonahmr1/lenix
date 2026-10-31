'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  MagnifyingGlassIcon,
  MusicNotesIcon,
  PlayIcon,
  QueueIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { AuthControls } from './auth-controls'
import { Playlists } from './playlists'
import type { Playlist } from './playlist-data'

function Queue() {
  return (
    <div className="space-y-3 p-5 text-sm text-muted-foreground">
      <QueueIcon className="size-6" aria-hidden="true" />
      <p>Nothing queued yet.</p>
    </div>
  )
}

type AppShellProps = {
  email: string | null
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

function PlaylistShell({ email, playlists, playlistError }: AppShellProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { toggleSidebar, setOpenMobile } = useSidebar()
  const selected = playlists.find(playlist => playlist.id === selectedId)

  useEffect(() => {
    if (!playlistError) return
    const id = toast.error(playlistError, { id: 'tone-playlists-error' })
    return () => {
      toast.dismiss(id)
    }
  }, [playlistError])

  function selectPlaylist(id: string) {
    setSelectedId(id)
    setOpenMobile(false)
  }

  const playlistList = (
    <Playlists
      playlists={playlists}
      error={playlistError}
      selectedId={selectedId}
      onSelect={selectPlaylist}
    />
  )

  return (
    <>
      <Sidebar side="left" className="h-dvh" aria-label="Playlists">
        <SidebarHeader className="not-typeset flex-row items-center justify-between p-4">
          <h2 className="text-sm font-medium">Playlists</h2>
          <SidebarTrigger className="size-11" aria-label="Toggle playlists" />
        </SidebarHeader>
        <SidebarContent className="not-typeset">{playlistList}</SidebarContent>
      </Sidebar>
      <SidebarProvider
        cookieName="tone_queue_sidebar"
        keyboardShortcut={null}
        className="min-h-0 min-w-0 flex-1"
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 flex-wrap items-center gap-3 border-b p-4">
            <Button
              variant="ghost"
              className="size-11"
              aria-label="Toggle playlists"
              onClick={toggleSidebar}
            >
              <MusicNotesIcon aria-hidden="true" />
            </Button>
            <span className="text-2xl font-medium tracking-tight">Tonelix</span>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden max-w-56 truncate text-sm text-muted-foreground xl:block">
                {email}
              </span>
              <AuthControls account={{ email }} initialMessage={null} compact />
              <SidebarTrigger className="size-11" aria-label="Toggle queue">
                <QueueIcon aria-hidden="true" />
              </SidebarTrigger>
            </div>
          </header>

          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-6">
            <div className="relative mx-auto w-full max-w-xl">
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="absolute top-3 left-3 size-5 text-muted-foreground"
              />
              <Input
                disabled
                aria-label="Search tracks"
                placeholder="Search tracks"
                className="h-11 pl-10 text-sm"
              />
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="rounded-full bg-muted p-5">
                <MusicNotesIcon
                  aria-hidden="true"
                  className="size-8 text-muted-foreground"
                />
              </div>
              <h1 className="text-2xl font-medium tracking-tight">
                {selected ? selected.label : 'Your space for music'}
              </h1>
              <p className="max-w-xs text-sm text-muted-foreground">
                {selected
                  ? `${selected.trackCount} ${selected.trackCount === 1 ? 'track' : 'tracks'}`
                  : 'Choose a playlist or create one to get started.'}
              </p>
            </div>
          </main>

          <footer
            aria-label="Playback"
            className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-muted p-3">
                <MusicNotesIcon aria-hidden="true" className="size-5" />
              </div>
              <p className="text-sm text-muted-foreground">Nothing playing</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                disabled
                variant="ghost"
                className="size-11"
                aria-label="Previous track"
              >
                <SkipBackIcon aria-hidden="true" />
              </Button>
              <Button
                disabled
                className="size-11 rounded-full"
                aria-label="Play"
              >
                <PlayIcon aria-hidden="true" weight="fill" />
              </Button>
              <Button
                disabled
                variant="ghost"
                className="size-11"
                aria-label="Next track"
              >
                <SkipForwardIcon aria-hidden="true" />
              </Button>
            </div>
          </footer>
        </div>
        <Sidebar side="right" className="h-dvh" aria-label="Queue">
          <SidebarHeader className="not-typeset flex-row items-center justify-between p-4">
            <h2 className="text-sm font-medium">Queue</h2>
            <SidebarTrigger className="size-11" aria-label="Toggle queue">
              <QueueIcon aria-hidden="true" />
            </SidebarTrigger>
          </SidebarHeader>
          <SidebarContent className="not-typeset">
            <Queue />
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </>
  )
}

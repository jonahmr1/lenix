'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  MagnifyingGlassIcon,
  MusicNotesIcon,
  PlayIcon,
  QueueIcon,
  SidebarIcon,
  SkipBackIcon,
  SkipForwardIcon,
  UserCircleIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverTrigger,
} from '@/components/ui/popover'
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
    <div className="flex justify-evenly space-y-3 p-5 text-sm text-muted-foreground">
      <QueueIcon className="size-6" aria-hidden="true" />
      <p>Nothing queued yet.</p>
    </div>
  )
}

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
  const { playlistId } = useParams<{ playlistId?: string }>()
  const { toggleSidebar, setOpenMobile, open, openMobile, isMobile } =
    useSidebar()
  const initials = name
    ? name
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0])
        .join('')
        .toUpperCase()
    : email?.[0]?.toUpperCase()
  const accountAvatar = (
    <Avatar>
      <AvatarImage src={avatarUrl ?? undefined} alt="" />
      <AvatarFallback>
        {initials || <UserCircleIcon aria-hidden="true" className="size-5" />}
      </AvatarFallback>
    </Avatar>
  )

  useEffect(() => {
    if (!playlistError) return
    const id = toast.error(playlistError, { id: 'tone-playlists-error' })
    return () => {
      toast.dismiss(id)
    }
  }, [playlistError])

  function selectPlaylist() {
    setOpenMobile(false)
  }

  const playlistList = (
    <Playlists
      playlists={playlists}
      error={playlistError}
      selectedId={playlistId ?? null}
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="size-11"
                    aria-label="Open account menu"
                  >
                    {accountAvatar}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="not-typeset p-4"
                  aria-label="Your account"
                >
                  <div className="flex items-center gap-3">
                    {accountAvatar}
                    <PopoverHeader className="min-w-0">
                      <PopoverTitle className="break-words">
                        {name ?? 'Your account'}
                      </PopoverTitle>
                      <PopoverDescription className="break-all">
                        {email ?? 'Signed in with Google'}
                      </PopoverDescription>
                    </PopoverHeader>
                  </div>
                  <AuthControls
                    account={{ email }}
                    initialMessage={null}
                    compact
                  />
                </PopoverContent>
              </Popover>
              <QueueTrigger />
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
            {children}
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
            <SidebarTrigger className="size-11" aria-label="Toggle queue" />
            <h2 className="text-sm font-medium">Queue</h2>
          </SidebarHeader>
          <SidebarContent className="not-typeset">
            <Queue />
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </>
  )
}

function QueueTrigger() {
  const { open, openMobile, isMobile } = useSidebar()
  if (isMobile ? openMobile : open) return null
  return (
    <SidebarTrigger
      className="group/toggle ml-3 h-11 w-11 overflow-hidden border-0 p-0 transition-[width,margin,opacity] duration-200 ease-out motion-reduce:transition-none [@media(hover:hover)]:ml-0 [@media(hover:hover)]:w-0 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within/queue-control:ml-3 [@media(hover:hover)]:group-focus-within/queue-control:w-11 [@media(hover:hover)]:group-focus-within/queue-control:opacity-100 [@media(hover:hover)]:group-hover/queue-control:ml-3 [@media(hover:hover)]:group-hover/queue-control:w-11 [@media(hover:hover)]:group-hover/queue-control:opacity-100"
      aria-label="Toggle queue"
    >
      <QueueIcon aria-hidden="true" className="group-hover/toggle:hidden" />
      <SidebarIcon
        aria-hidden="true"
        className="hidden group-hover/toggle:block"
      />
    </SidebarTrigger>
  )
}

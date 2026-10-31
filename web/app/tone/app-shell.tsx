'use client'

import {
  ListIcon,
  MagnifyingGlassIcon,
  MusicNotesIcon,
  PlayIcon,
  PlusIcon,
  QueueIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { AuthControls } from './auth-controls'

function Playlists() {
  return (
    <div className="space-y-6 p-5">
      <Button disabled variant="outline" className="h-10 w-full gap-2 text-sm">
        <PlusIcon aria-hidden="true" />
        Create playlist
      </Button>
      <p className="text-sm text-muted-foreground">
        Your playlists will appear here.
      </p>
    </div>
  )
}

function Queue() {
  return (
    <div className="space-y-3 p-5 text-sm text-muted-foreground">
      <QueueIcon className="size-6" aria-hidden="true" />
      <p>Nothing queued yet.</p>
    </div>
  )
}

export function AppShell({ email }: { email: string | null }) {
  return (
    <div className="not-typeset flex h-dvh flex-col bg-background text-foreground">
      <header className="flex shrink-0 items-center gap-3 border-b p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="size-11 lg:hidden"
              aria-label="Open playlists"
            >
              <ListIcon aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="not-typeset overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Playlists</SheetTitle>
              <SheetDescription>Your music, organized by you.</SheetDescription>
            </SheetHeader>
            <Playlists />
          </SheetContent>
        </Sheet>
        <span className="text-2xl font-medium tracking-tight">Tone</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden max-w-56 truncate text-sm text-muted-foreground md:block">
            {email}
          </span>
          <AuthControls account={{ email }} initialMessage={null} compact />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="size-11 lg:hidden"
                aria-label="Open queue"
              >
                <QueueIcon aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="not-typeset overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Queue</SheetTitle>
                <SheetDescription>
                  Up next in your listening session.
                </SheetDescription>
              </SheetHeader>
              <Queue />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          aria-label="Playlists"
          className="hidden w-60 shrink-0 overflow-y-auto border-r lg:block"
        >
          <h2 className="px-5 pt-6 text-sm font-medium">Playlists</h2>
          <Playlists />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto p-6">
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
              Your space for music
            </h1>
            <p className="max-w-xs text-sm text-muted-foreground">
              Your playlists and tracks will live here.
            </p>
          </div>
        </main>

        <aside
          aria-label="Queue"
          className="hidden w-60 shrink-0 overflow-y-auto border-l lg:block"
        >
          <h2 className="px-5 pt-6 text-sm font-medium">Queue</h2>
          <Queue />
        </aside>
      </div>

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
          <Button disabled className="size-11 rounded-full" aria-label="Play">
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
  )
}

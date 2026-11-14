'use client'

import type { ReactNode } from 'react'
import { SidebarIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { AppProvider, useApp } from './provider'

export default function ToneLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <PlaylistsLayout>{children}</PlaylistsLayout>
    </AppProvider>
  )
}

function PlaylistsLayout({ children }: { children: ReactNode }) {
  const { state, setState } = useApp()

  return (
    <SidebarProvider
      open={state.playlistsOpen}
      onOpenChange={playlistsOpen =>
        setState(previous => ({ ...previous, playlistsOpen }))
      }
      cookieName="tone_playlists_sidebar"
      className="not-typeset dark grid h-dvh min-h-0 grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[2rem_2.5rem_minmax(0,1fr)] overflow-hidden bg-sidebar text-neutral-100 [&_[data-slot=sidebar]]:relative"
    >
      <header className="col-span-full row-start-1 flex items-center justify-center border-b border-amber-900/60 bg-amber-950 text-xs font-medium text-amber-200">
        Tonelix is still being built. Features may change.
      </header>
      <Sidebar
        variant="inset"
        aria-label="Playlists"
        className="absolute h-full"
      >
        <SidebarHeader className="flex-row items-center justify-between p-6">
          <h2 className="text-base font-semibold">Playlists</h2>
          <SidebarTrigger aria-label="Close playlists" className="md:hidden" />
        </SidebarHeader>
      </Sidebar>
      <QueueLayout>{children}</QueueLayout>
    </SidebarProvider>
  )
}

function QueueLayout({ children }: { children: ReactNode }) {
  const { state, setState } = useApp()
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarProvider
      open={state.queueOpen}
      onOpenChange={queueOpen =>
        setState(previous => ({ ...previous, queueOpen }))
      }
      keyboardShortcut={null}
      cookieName="tone_queue_sidebar"
      className="contents"
    >
      <header className="col-span-full row-start-2 flex items-center gap-3 bg-sidebar px-6">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Toggle playlists"
          onClick={toggleSidebar}
        >
          <SidebarIcon aria-hidden="true" />
        </Button>
        <h1 className="text-lg font-semibold tracking-tight">Tonelix</h1>
        <SidebarTrigger aria-label="Toggle queue" className="ml-auto" />
      </header>

      <Sidebar
        side="right"
        variant="inset"
        aria-label="Queue"
        className="absolute h-full"
      >
        <SidebarHeader className="flex-row items-center justify-between p-6">
          <h2 className="text-base font-semibold">Queue</h2>
          <SidebarTrigger aria-label="Close queue" className="md:hidden" />
        </SidebarHeader>
      </Sidebar>

      <SidebarInset
        className={`col-start-2 row-start-3 mt-0! min-h-0 w-auto min-w-0 overflow-hidden bg-neutral-950 ${state.playlistsOpen ? 'md:ms-0!' : 'md:ms-2!'}`}
      >
        <div className="px-6 pt-6">
          <Input
            type="search"
            aria-label="Search YouTube tracks"
            placeholder="Search YouTube tracks"
            disabled
            className="mx-auto block h-12 max-w-2xl border-neutral-700 bg-neutral-900 px-4 text-base disabled:opacity-100 md:text-sm"
          />
        </div>
        <section
          aria-label="Tracks"
          className="min-h-0 flex-1 overflow-y-auto p-6"
        >
          {children}
        </section>
        <footer
          aria-label="Player"
          className="h-20 shrink-0 border-t border-neutral-800"
        />
      </SidebarInset>
    </SidebarProvider>
  )
}

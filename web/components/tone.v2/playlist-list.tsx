'use client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MusicNotesIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import type { Playlist } from '@/app/tone/playlist-data'

export function PlaylistList({
  playlists,
  error,
  selectedId,
  onSelect,
}: {
  playlists: Playlist[]
  error: string | null
  selectedId: string | null
  onSelect: () => void
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  return (
    <div className="space-y-5 p-5">
      {error ? (
        <Button
          variant="outline"
          className="h-10 w-full text-sm"
          disabled={pending}
          onClick={() => startTransition(() => router.refresh())}
        >
          {pending ? 'Loading…' : 'Retry loading playlists'}
        </Button>
      ) : playlists.length ? (
        <SidebarMenu aria-label="Your playlists">
          {playlists.map(playlist => (
            <SidebarMenuItem key={playlist.id}>
              <SidebarMenuButton
                asChild
                isActive={selectedId === playlist.id}
                className="h-auto min-h-11 w-full justify-start gap-3 px-3 py-2 text-left text-sm"
              >
                <Link
                  href={`/tone/playlist/${playlist.id}`}
                  onClick={onSelect}
                  aria-current={selectedId === playlist.id ? 'page' : undefined}
                >
                  <MusicNotesIcon aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">
                    {playlist.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {playlist.trackCount}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      ) : (
        <p className="text-sm text-muted-foreground">
          No playlists yet. Create your first one.
        </p>
      )}
    </div>
  )
}

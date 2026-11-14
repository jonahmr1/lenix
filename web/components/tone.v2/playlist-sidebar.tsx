'use client'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import type { Playlist } from '@/app/tone/playlist-data'
import { PlaylistList } from './playlist-list'
import { CreatePlaylistDialog } from './create-playlist-dialog'

export function PlaylistSidebar({
  playlists,
  playlistError,
}: {
  playlists: Playlist[]
  playlistError: string | null
}) {
  const { playlistId } = useParams<{ playlistId?: string }>()
  const { setOpenMobile } = useSidebar()
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
    <PlaylistList
      playlists={playlists}
      error={playlistError}
      selectedId={playlistId ?? null}
      onSelect={selectPlaylist}
    />
  )

  return (
    <Sidebar side="left" className="absolute h-full" aria-label="Playlists">
      <SidebarHeader className="not-typeset flex-row items-center justify-between p-4">
				<h2 className="text-sm font-medium">Playlists</h2>
        <div className="group/create-playlist flex items-center gap-1">
          <CreatePlaylistDialog onCreated={selectPlaylist} />
					<SidebarTrigger className="size-11" aria-label="Toggle playlists" />
        </div>
      </SidebarHeader>
      <SidebarContent className="not-typeset">{playlistList}</SidebarContent>
    </Sidebar>
  )
}

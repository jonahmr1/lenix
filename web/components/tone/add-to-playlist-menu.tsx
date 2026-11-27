'use client'

import {
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useApp } from '@/app/tone/provider'
import { setTrackInPlaylist } from '@/lib/tone/track-actions'
import type { SearchTrack } from '@/lib/tone/search-actions'
import {
  ContextMenuGroup,
  ContextMenuCheckboxItem,
} from '@/components/ui/context-menu'

export function AddToPlaylistMenu({
  tracks,
  dropdown = false,
}: {
  tracks: SearchTrack[]
  dropdown?: boolean
}) {
  const MenuGroup = dropdown ? DropdownMenuGroup : ContextMenuGroup
  const MenuCheckboxItem = dropdown
    ? DropdownMenuCheckboxItem
    : ContextMenuCheckboxItem
  const { state, setState } = useApp()
  return (
    <MenuGroup>
      {state.playlists.map(playlist => (
        <MenuCheckboxItem
          key={playlist.id}
          checked={
            tracks.every(track => playlist.tracks.includes(track.id))
              ? true
              : tracks.some(track => playlist.tracks.includes(track.id))
                ? 'indeterminate'
                : false
          }
          onCheckedChange={async checked => {
            const saving = toast.loading(
              checked ? 'Adding track…' : 'Removing track…'
            )
            try {
              const result = await setTrackInPlaylist(
                playlist.id,
                tracks.map(track => track.id),
                checked === true
              )
              if ('error' in result) throw new Error(result.error)
              setState(previous => ({
                ...previous,
                playlists: previous.playlists.map(item =>
                  item.id === playlist.id
                    ? {
                        ...item,
                        tracks: checked
                          ? [
                              ...new Set([
                                ...item.tracks,
                                ...tracks.map(track => track.id),
                              ]),
                            ]
                          : item.tracks.filter(
                              id => !tracks.some(track => track.id === id)
                            ),
                      }
                    : item
                ),
              }))
              toast.success(
                checked
                  ? `Added to ${result.playlistName}`
                  : `Removed from ${result.playlistName}`,
                { id: saving }
              )
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : 'Couldn’t update this playlist. Please try again.',
                { id: saving }
              )
            }
          }}
        >
          {playlist.name}
        </MenuCheckboxItem>
      ))}
    </MenuGroup>
  )
}

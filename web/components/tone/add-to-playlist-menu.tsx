'use client'

import { toast } from 'sonner'
import { useApp } from '@/app/tone/provider'
import { setTrackInPlaylist } from '@/lib/tone/track-actions'
import type { SearchTrack } from '@/lib/tone/search-actions'
import {
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuCheckboxItem,
} from '@/components/ui/context-menu'

export function AddToPlaylistMenu({ track }: { track: SearchTrack }) {
  const { state, setState } = useApp()
  return (
    <ContextMenuGroup>
      <ContextMenuLabel>Add to playlist</ContextMenuLabel>
      {state.playlists.map(playlist => (
        <ContextMenuCheckboxItem
          key={playlist.id}
          checked={playlist.tracks.includes(track.id)}
          onCheckedChange={async checked => {
            const saving = toast.loading(
              checked ? 'Adding track…' : 'Removing track…'
            )
            try {
              const result = await setTrackInPlaylist(
                playlist.id,
                track.id,
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
                          ? [...new Set([...item.tracks, track.id])]
                          : item.tracks.filter(id => id !== track.id),
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
        </ContextMenuCheckboxItem>
      ))}
    </ContextMenuGroup>
  )
}

'use client'

import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { SparkleIcon } from '@phosphor-icons/react'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuCheckboxItem,
} from '@/components/ui/context-menu'
import { useApp } from '@/app/tone/provider'
import { setTrackInPlaylist } from '@/lib/tone/track-actions'
import { autoFitTrack } from '@/lib/tone/autofit-actions'
import type { SearchTrack } from '@/lib/tone/search-actions'

export function SearchTrackMenu({
  track,
  children,
}: {
  track: SearchTrack
  children: ReactNode
}) {
  const { state, setState } = useApp()
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem
            disabled={state.autoFitPending}
            onSelect={async () => {
              if (state.autoFitPending) return
              setState(previous => ({
                ...previous,
                autoFitPending: true,
              }))
              const notification = toast.loading('Finding a playlist…')
              try {
                const result = await autoFitTrack(track.id)
                if ('error' in result) throw new Error(result.error)
                setState(previous => ({
                  ...previous,
                  playlists: previous.playlists.some(
                    p => p.id === result.playlist.id
                  )
                    ? previous.playlists.map(p =>
                        p.id === result.playlist.id ? result.playlist : p
                      )
                    : [...previous.playlists, result.playlist],
                }))
                toast.success(
                  result.created
                    ? `Created “${result.playlist.name}” and added track.`
                    : `Added to “${result.playlist.name}”.`,
                  { id: notification }
                )
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : 'Couldn’t auto-fit this track. Please try again.',
                  { id: notification }
                )
              } finally {
                setState(previous => ({
                  ...previous,
                  autoFitPending: false,
                }))
              }
            }}
          >
            <SparkleIcon />
            <span>Auto-fit</span>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
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
      </ContextMenuContent>
    </ContextMenu>
  )
}

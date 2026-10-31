'use client'
import { useRef, useState, useTransition } from 'react'
import { PlusIcon, MusicNotesIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from '@/components/ui/popover'
import { Command, CommandList, CommandItem } from '@/components/ui/command'
import { addTrack } from '@/lib/tone/track-actions'
import type { Playlist } from '@/app/tone/playlist-data'
import type { Track } from '@/app/tone/youtube'

export function AddToPlaylistPopover({
  track,
  playlists,
}: {
  track: Track
  playlists: Playlist[]
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const saving = useRef(false)

  function save(playlist: Playlist) {
    if (saving.current) return
    saving.current = true
    startTransition(async () => {
      try {
        const result = await addTrack(playlist.id, track.id)
        if ('error' in result) {
          toast.error(result.error)
          return
        }
        setOpen(false)
        if (result.added) toast.success(`Added to ${result.playlistName}.`)
        else toast.info(`Already in ${result.playlistName}.`)
      } catch {
        toast.error('Couldn’t reach the server. Please try again.')
      } finally {
        saving.current = false
      }
    })
  }

  return (
    <Popover
      open={open}
      onOpenChange={value => {
        if (!saving.current) setOpen(value)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="size-11 shrink-0"
          aria-label={`Add ${track.title} to a playlist`}
        >
          <PlusIcon aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="not-typeset max-w-[calc(100vw-2rem)]"
        aria-label="Add to playlist"
      >
        <PopoverHeader>
          <PopoverTitle>Add to playlist</PopoverTitle>
        </PopoverHeader>
        {playlists.length ? (
          <Command
            aria-busy={pending}
            tabIndex={0}
            aria-label="Choose a playlist"
          >
            <CommandList aria-label="Choose a playlist">
              {playlists.map(playlist => (
                <CommandItem
                  key={playlist.id}
                  value={playlist.id}
                  disabled={pending}
                  onSelect={() => save(playlist)}
                  className="min-h-11 text-sm"
                >
                  <MusicNotesIcon aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">
                    {playlist.label}
                  </span>
                  <span className="text-muted-foreground">
                    {playlist.trackCount}
                  </span>
                </CommandItem>
              ))}
            </CommandList>
            {pending && (
              <Spinner className="mx-auto my-2" aria-label="Adding track" />
            )}
          </Command>
        ) : (
          <p className="text-sm text-muted-foreground">
            Create a playlist from the Playlists sidebar first.
          </p>
        )}
      </PopoverContent>
    </Popover>
  )
}

'use client'
import Image from 'next/image'
import { MusicNotesIcon } from '@phosphor-icons/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import type { Playlist } from '@/app/tone/playlist-data'
import type { Track } from '@/app/tone/youtube'
import { AddToPlaylistPopover } from './add-to-playlist-popover'

export function TrackTable({
  tracks,
  playlists,
}: {
  tracks: Track[]
  playlists?: Playlist[]
}) {
  return (
    <>
      <Table className="table-fixed" aria-label="Tracks">
        <TableHeader>
          <TableRow>
            {!playlists && (
              <TableHead className="w-12 text-center">#</TableHead>
            )}
            <TableHead>Track</TableHead>
            <TableHead className="hidden w-1/4 sm:table-cell">
              Channel
            </TableHead>
            {playlists && (
              <TableHead className="w-16">
                <span className="sr-only">Add to playlist</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracks.map((track, index) => (
            <TableRow key={`${track.id}-${index}`}>
              {!playlists && (
                <TableCell className="text-center text-muted-foreground tabular-nums">
                  {index + 1}
                </TableCell>
              )}
              <TableCell className="whitespace-normal">
                <div className="flex items-center gap-3">
                  <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                    {/^[\w-]{11}$/.test(track.id) ? (
                      <Image
                        unoptimized
                        src={`https://i.ytimg.com/vi/${track.id}/default.jpg`}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <MusicNotesIcon aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-medium break-words">
                      {track.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground sm:hidden">
                      {track.channel || 'YouTube'}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                <span className="block truncate">
                  {track.channel || 'YouTube'}
                </span>
              </TableCell>
              {playlists && (
                <TableCell className="text-right">
                  <AddToPlaylistPopover track={track} playlists={playlists} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

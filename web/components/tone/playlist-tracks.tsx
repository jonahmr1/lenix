'use client'

import Link from './navigation-link'
import { createPriorityQueue, normalizeTiers } from '@/lib/tone/priority-queue'
import { useEffect } from 'react'
import { markPlaylistPlayed } from '@/lib/tone/playlist-actions'
import { toast } from 'sonner'
import type { SearchTrack } from '@/lib/tone/search-actions'
import { TrackTable } from './track-table'
import { TrackMenu } from './track-menu'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, DotIcon, PlayIcon } from '@phosphor-icons/react'
import { notFound, useParams } from 'next/navigation'
import { useApp } from '@/app/tone/provider'
import { Separator } from '../ui/separator'

export function PlaylistTracks({
  tracks,
  error,
}: {
  tracks: SearchTrack[]
  error?: string
}) {
  const { playlistId } = useParams<{ playlistId: string }>()
  const { state, setState } = useApp()
  const playlist = state.playlists.find(playlist => playlist.id === playlistId)

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])
  if (!playlist) notFound()
  const tiers = normalizeTiers(
    playlist.tracks,
    Object.fromEntries(
      playlist.tracks.map(id => [
        id,
        state.trackTiers[`${playlist.id}:${id}`] ?? 1,
      ])
    )
  )
  const visibleTracks = tracks
    .filter(track => playlist.tracks.includes(track.id))
    .sort((a, b) => tiers[a.id] - tiers[b.id])

  return (
    <div className='not-typeset flex flex-1 flex-col gap-6 p-4 md:p-6'>
      <Button asChild variant='ghost' size='icon' className='self-start'>
        <Link href='/tone' aria-label='Back to home'>
          <ArrowLeftIcon />
        </Link>
      </Button>
      <h1 className='text-8xl font-bold'>{playlist.name}</h1>
      <Separator />
      <div className='flex items-center'>
        <Button
          className='size-12 rounded-full'
          size='icon-lg'
          aria-label='Play playlist'
          disabled={!visibleTracks.length}
          onClick={() => {
            const queue = createPriorityQueue(
              visibleTracks,
              playlist.id,
              state.trackTiers
            )
            state.player?.loadVideoById(queue[0].id)
            setState(previous => ({
              ...previous,
              playlists: [
                playlist,
                ...previous.playlists.filter(item => item.id !== playlist.id),
              ],
              queue,
              nextQueue: previous.repeatQueue
                ? createPriorityQueue(
                    visibleTracks,
                    playlist.id,
                    previous.trackTiers
                  )
                : [],
              queueIndex: 0,
              queuePlaylistId: playlist.id,
              currentTrack: queue[0],
            }))
            void markPlaylistPlayed(playlist.id)
              .then(saved => {
                if (!saved) toast.error('Couldn’t sync the playlist order.')
              })
              .catch(() => toast.error('Couldn’t sync the playlist order.'))
          }}
        >
          <PlayIcon className='size-1/2' weight='fill' />
        </Button>
        <DotIcon className='text-5xl' />
        <p>{visibleTracks.length} Track</p>
      </div>
      {visibleTracks.length ? (
        <TrackTable
          tracks={visibleTracks}
          playlistId={playlist.id}
          tiers={tiers}
          renderMenu={(track, row) => (
            <TrackMenu track={track} playlistId={playlist.id}>
              {row}
            </TrackMenu>
          )}
        />
      ) : (
        !error && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No tracks yet</EmptyTitle>
              <EmptyDescription>
                Search for music and add tracks to this playlist.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )
      )}
    </div>
  )
}

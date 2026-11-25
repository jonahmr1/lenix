'use client'

import Link from './navigation-link'
import { createPriorityQueue, normalizeTiers } from '@/lib/tone/priority-queue'
import { useEffect } from 'react'
import { setTrackTier } from '@/lib/tone/tier-actions'
import { toast } from 'sonner'
import type { SearchTrack } from '@/lib/tone/search-actions'
import { TrackTable } from './track-table'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import {
  ArrowLeftIcon,
  DotIcon,
  MinusIcon,
  PlayIcon,
  PlusIcon,
} from '@phosphor-icons/react'
import { notFound, useParams } from 'next/navigation'
import { useApp } from '@/app/tone/provider'
import { Separator } from '../ui/separator'
import { setTrackInPlaylist } from '@/lib/tone/track-actions'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from '../ui/context-menu'

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
  const tierCount = Math.max(0, ...Object.values(tiers))
  async function changeTier(id: string, target: number | 'ascend' | 'descend') {
    try {
      const result = await setTrackTier(playlist!.id, id, target)
      if ('error' in result) {
        toast.error(result.error)
        return
      }
      setState(previous => ({
        ...previous,
        trackTiers: {
          ...Object.fromEntries(
            Object.entries(previous.trackTiers).filter(
              ([key]) => !key.startsWith(`${playlist!.id}:`)
            )
          ),
          ...Object.fromEntries(
            Object.entries(result.tiers).map(([id, tier]) => [
              `${playlist!.id}:${id}`,
              tier,
            ])
          ),
        },
      }))
    } catch {
      toast.error('Couldn’t save the tier. Please try again.')
    }
  }
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
          }}
        >
          <PlayIcon className='size-1/2' weight='fill' />
        </Button>
        <DotIcon className='text-5xl' />
        <p>{visibleTracks.length} Track</p>
      </div>
      {visibleTracks.length ? (
        <TrackTable tracks={visibleTracks} tiers={tiers} renderMenu={(track, row) => (
                <ContextMenu>
                  <ContextMenuTrigger asChild>{row}</ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuSub>
                      <ContextMenuSubTrigger>Tier</ContextMenuSubTrigger>
                      <ContextMenuSubContent>
                        <ContextMenuRadioGroup
                          value={String(tiers[track.id])}
                          onValueChange={value =>
                            changeTier(track.id, Number(value))
                          }
                        >
                          <ContextMenuItem
                            onSelect={() => changeTier(track.id, 'ascend')}
                            className='justify-center'
                          >
                            <PlusIcon />
                          </ContextMenuItem>
                          {Array.from({ length: tierCount }, (_, index) => (
                            <ContextMenuRadioItem
                              key={index + 1}
                              value={String(index + 1)}
                            >
                              Tier {index + 1}
                            </ContextMenuRadioItem>
                          ))}
                        </ContextMenuRadioGroup>
                        {(tiers[track.id] < tierCount ||
                          Object.values(tiers).filter(
                            tier => tier === tierCount
                          ).length > 1) && (
                          <ContextMenuItem
                            onSelect={() => changeTier(track.id, 'descend')}
                            className='justify-center'
                          >
                            <MinusIcon />
                          </ContextMenuItem>
                        )}
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuItem
                      variant='destructive'
                      onSelect={async () => {
                        const saving = toast.loading('Removing track…')
                        try {
                          const result = await setTrackInPlaylist(
                            playlist.id,
                            track.id,
                            false
                          )
                          if ('error' in result) throw new Error(result.error)
                          setState(previous => ({
                            ...previous,
                            playlists: previous.playlists.map(item =>
                              item.id === playlist.id
                                ? {
                                    ...item,
                                    tracks: item.tracks.filter(
                                      id => id !== track.id
                                    ),
                                  }
                                : item
                            ),
                          }))
                          toast.success(`Removed from ${result.playlistName}`, {
                            id: saving,
                          })
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : 'Couldn’t remove this track. Please try again.',
                            { id: saving }
                          )
                        }
                      }}
                    >
                      Remove from playlist
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
        )} />
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

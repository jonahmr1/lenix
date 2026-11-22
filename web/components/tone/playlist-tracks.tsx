'use client'

import Link from './navigation-link'
import { createPriorityQueue, normalizeTiers } from '@/lib/tone/priority-queue'
import { Fragment, useEffect } from 'react'
import { setTrackTier } from '@/lib/tone/tier-actions'
import { toast } from 'sonner'
import type { SearchTrack } from '@/lib/tone/search-actions'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
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
            if (state.currentTrack?.id === queue[0].id) {
              state.player?.seekTo(0, true)
              state.player?.playVideo()
            }
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className='hidden sm:table-cell'>Author</TableHead>
              <TableHead className='text-right'>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleTracks.map((track, index) => (
              <Fragment key={track.id}>
                {(index === 0 ||
                  tiers[visibleTracks[index - 1].id] !== tiers[track.id]) && (
                  <TableRow className='bg-muted/50 hover:bg-muted/50'>
                    <TableHead colSpan={4}>Tier {tiers[track.id]}</TableHead>
                  </TableRow>
                )}
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <TableRow
                      className='cursor-pointer border-0'
                      tabIndex={0}
                      aria-label={`Play ${track.title}`}
                      data-state={
                        state.currentTrack?.id === track.id
                          ? 'selected'
                          : undefined
                      }
                      onClick={() =>
                        setState(previous => ({
                          ...previous,
                          currentTrack: track,
                        }))
                      }
                      onKeyDown={event => {
                        if (event.target !== event.currentTarget) return
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setState(previous => ({
                            ...previous,
                            currentTrack: track,
                          }))
                        }
                      }}
                    >
                      <TableCell className='text-muted-foreground tabular-nums'>
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <img
                            src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`}
                            alt=''
                            width={32}
                            height={32}
                            className='size-8 shrink-0 rounded-md object-cover'
                          />
                          <div className='min-w-0'>
                            <p className='font-medium whitespace-normal'>
                              {track.title}
                            </p>
                            <p className='mt-1 whitespace-normal text-muted-foreground sm:hidden'>
                              {track.channel}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='hidden whitespace-normal text-muted-foreground sm:table-cell'>
                        {track.channel}
                      </TableCell>
                      <TableCell className='text-right text-muted-foreground tabular-nums'>
                        {track.duration}
                      </TableCell>
                    </TableRow>
                  </ContextMenuTrigger>
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
              </Fragment>
            ))}
          </TableBody>
        </Table>
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

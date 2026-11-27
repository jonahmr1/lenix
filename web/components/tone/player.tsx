'use client'

import { useEffect } from 'react'
import { useApp } from '@/app/tone/provider'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { LockSimpleIcon, MusicNotesIcon, XIcon } from '@phosphor-icons/react'
import { PlayButton, PlayerControls } from './player-controls'
import { VolumeControls, Timeline } from './player-sliders'
import { TrackMenu } from './track-menu'
import { PocketMode } from './pocket-mode'
export function Player() {
  const { state, setState } = useApp()
  const { isMobile } = useSidebar()
  const { currentTrack: track, player } = state
  const pocketActive = state.pocketMode !== null
  useEffect(() => {
    if (!player) return
    let cancelled = false
    const timer = window.setInterval(async () => {
      try {
        const [time, duration, volume, muted, rate, rates, playerState] =
          await Promise.all([
            player.getCurrentTime(),
            player.getDuration(),
            player.getVolume(),
            player.isMuted(),
            player.getPlaybackRate(),
            player.getAvailablePlaybackRates(),
            player.getPlayerState(),
          ])
        if (!cancelled)
          setState(previous => ({
            ...previous,
            playback: {
              ...previous.playback,
              time:
                playerState === 5 || playerState === -1
                  ? previous.playback.time
                  : (time ?? previous.playback.time),
              duration: duration || previous.playback.duration,
              volume: volume ?? previous.playback.volume,
              muted: muted ?? previous.playback.muted,
              rate: rate || previous.playback.rate,
              rates: rates?.length ? [...rates] : previous.playback.rates,
            },
          }))
      } catch {}
    }, 500)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [player, setState])

  return isMobile || state.playerExpanded ? (
    <Drawer
      dismissible={!pocketActive}
      open={state.playerExpanded}
      onOpenChange={playerExpanded =>
        !pocketActive && setState(previous => ({ ...previous, playerExpanded }))
      }
    >
      <footer
        aria-label='Player'
        className='shrink-0 space-y-2 bg-sidebar px-3 py-2'
      >
        <TrackMenu track={track} playlistId={state.queuePlaylistId}>
          <div className='flex items-center gap-3'>
            {track && (
              <img
                src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`}
                alt=''
                width={40}
                height={40}
                className='size-10 shrink-0 rounded-md object-cover'
              />
            )}
            <DrawerTrigger asChild>
              <button
                className='min-w-0 flex-1 text-left'
                aria-label='Expand player'
              >
                <span className='block truncate text-sm font-medium'>
                  {track?.title ?? 'Nothing playing'}
                </span>
                {track && (
                  <span className='block truncate text-xs text-muted-foreground'>
                    {track.channel}
                  </span>
                )}
              </button>
            </DrawerTrigger>
            <PlayButton />
          </div>
        </TrackMenu>
        <Timeline />
      </footer>
      <DrawerContent className='mt-0! h-dvh! max-h-dvh! overflow-y-auto p-0 before:inset-0 before:rounded-none before:border-0'>
        {pocketActive ? (
          <PocketMode />
        ) : (
          <>
            <Button
              variant='ghost'
              size='icon-sm'
              className='absolute top-4 left-4'
              aria-label='Pocket mode'
              onClick={() =>
                setState(previous => ({ ...previous, pocketMode: 'locked' }))
              }
            >
              <LockSimpleIcon />
            </Button>
            <DrawerClose asChild>
              <Button
                variant='ghost'
                size='icon-sm'
                className='absolute top-4 right-4'
                aria-label='Collapse player'
              >
                <XIcon />
              </Button>
            </DrawerClose>
            <DrawerHeader>
              <DrawerTitle>Now playing</DrawerTitle>
              <DrawerDescription className='sr-only'>
                Track details and playback controls.
              </DrawerDescription>
            </DrawerHeader>
            <div className='flex min-h-0 flex-1 flex-col justify-center gap-6 px-6 pb-8 landscape:grid landscape:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] landscape:content-center landscape:items-center landscape:gap-x-6 landscape:gap-y-2 landscape:pb-3 landscape:[&>:first-child]:row-span-4 landscape:[&>:first-child]:w-[min(100%,52dvh)] landscape:[&>:first-child]:justify-self-center'>
              {track ? (
                <img
                  src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`}
                  alt=''
                  width={320}
                  height={320}
                  className='aspect-square w-full shrink-0 self-center rounded-xl object-cover'
                />
              ) : (
                <div className='flex aspect-square w-full shrink-0 items-center justify-center rounded-xl bg-muted'>
                  <MusicNotesIcon
                    className='size-16 text-muted-foreground'
                    aria-hidden='true'
                  />
                </div>
              )}
              <TrackMenu track={track} playlistId={state.queuePlaylistId}>
                <div>
                  <p className='text-xl font-semibold wrap-break-word text-foreground'>
                    {track?.title ?? 'Nothing playing'}
                  </p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    {track?.channel ??
                      'Choose a track or playlist to start listening.'}
                  </p>
                </div>
              </TrackMenu>
              <Timeline />
              <PlayerControls />
              <VolumeControls />
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  ) : (
    <footer
      aria-label='Player'
      className='flex h-15 shrink-0 items-center gap-3 bg-sidebar px-2'
    >
      <TrackMenu track={track} playlistId={state.queuePlaylistId}>
        <div className='hidden min-w-0 flex-1 items-center gap-3 sm:flex'>
          {track && (
            <img
              src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`}
              alt=''
              width={48}
              height={48}
              className='size-10 shrink-0 rounded-md object-cover'
            />
          )}
          <div className='min-w-0 *:text-foreground'>
            <p className='truncate text-sm font-medium'>
              {track?.title ?? 'Nothing playing'}
            </p>
            {track && (
              <p className='truncate text-xs text-muted-foreground!'>
                {track.channel}
              </p>
            )}
          </div>
        </div>
      </TrackMenu>
      <div className='flex min-w-0 flex-[2] flex-col gap-2'>
        <PlayerControls />
        <Timeline />
      </div>
      <VolumeControls />
    </footer>
  )
}

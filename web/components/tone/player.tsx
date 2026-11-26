'use client'

import { useEffect } from 'react'
import {
  advancePriorityQueue,
  createPriorityQueue,
} from '@/lib/tone/priority-queue'
import { useApp } from '@/app/tone/provider'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import {
  MusicNotesIcon,
  XIcon,
  PlayIcon,
  PauseIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  ArrowCounterClockwiseIcon,
  ArrowClockwiseIcon,
  RepeatIcon,
  RepeatOnceIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from '@phosphor-icons/react'

function timestamp(seconds: number) {
  const value = Math.max(0, Math.floor(seconds))
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
}

export function Player() {
  const { state, setState } = useApp()
  const { isMobile } = useSidebar()
  const { currentTrack: track, player, playback } = state
  const previousIndex =
    state.queueIndex > 0
      ? state.queueIndex - 1
      : state.repeatQueue
        ? state.queue.length - 1
        : -1
  const nextIndex =
    state.queueIndex + 1 < state.queue.length
      ? state.queueIndex + 1
      : state.repeatQueue
        ? 0
        : -1

  useEffect(() => {
    if (!player) return
    let cancelled = false
    const timer = window.setInterval(async () => {
      try {
        const [time, duration, volume, muted, rate, rates, playerState] = await Promise.all([
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
              time: playerState === 5 || playerState === -1 ? previous.playback.time : time ?? previous.playback.time,
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

  const playButton = (
    <Button
      size='icon-sm'
      className={
        state.playerExpanded
          ? 'size-14 shrink-0 rounded-full [&_svg]:size-7!'
          : 'rounded-full'
      }
      disabled={!player}
      aria-label={playback.playing ? 'Pause' : 'Play'}
      onClick={() =>
        playback.playing ? player?.pauseVideo() : player?.playVideo()
      }
    >
      {playback.playing ? (
        <PauseIcon weight='fill' />
      ) : (
        <PlayIcon weight='fill' />
      )}
    </Button>
  )
  const muteButton = (
    <Button
      variant='ghost'
      size='icon-sm'
      className={
        state.playerExpanded
          ? 'size-10 shrink-0 [&_svg]:size-5!'
          : undefined
      }
      disabled={!player}
      aria-label={playback.muted ? 'Unmute' : 'Mute'}
      onClick={() => (playback.muted ? player?.unMute() : player?.mute())}
    >
      {playback.muted ? <SpeakerSlashIcon /> : <SpeakerHighIcon />}
    </Button>
  )
  const controls = (
    <div className='flex flex-wrap items-center justify-center gap-1'>
      <Button
        size='icon-sm'
        className={
          state.playerExpanded
            ? 'size-10 shrink-0 [&_svg]:size-5!'
            : undefined
        }
        variant={state.repeatQueue ? 'secondary' : 'ghost'}
        aria-label='Repeat queue'
        title='Repeat queue'
        aria-pressed={state.repeatQueue}
        onClick={() =>
          setState(previous => ({
            ...previous,
            repeatQueue: !previous.repeatQueue,
            nextQueue: previous.repeatQueue
              ? []
              : createPriorityQueue(
                  previous.queue,
                  previous.queuePlaylistId ?? '',
                  previous.trackTiers
                ),
          }))
        }
      >
        <RepeatIcon />
      </Button>
      <Button
        variant='ghost'
        size='icon-sm'
        className={
          state.playerExpanded
            ? 'size-10 shrink-0 [&_svg]:size-5!'
            : undefined
        }
        disabled={!state.queue[previousIndex]}
        aria-label='Previous track'
        title='Previous track'
        onClick={() => {
          const previousTrack = state.queue[previousIndex]
          if (!previousTrack) return
          player?.loadVideoById(previousTrack.id)
          setState(previous => ({
            ...previous,
            queueIndex: previousIndex,
            currentTrack: previousTrack,
          }))
        }}
      >
        <SkipBackIcon weight='fill' />
      </Button>
      <Button
        variant='ghost'
        size='icon-sm'
        className={
          state.playerExpanded
            ? 'size-10 shrink-0 [&_svg]:size-5!'
            : undefined
        }
        disabled={!player}
        aria-label='Rewind 10 seconds'
        onClick={() => player?.seekTo(Math.max(0, playback.time - 10), true)}
      >
        <ArrowCounterClockwiseIcon />
      </Button>
      {playButton}
      <Button
        variant='ghost'
        size='icon-sm'
        className={
          state.playerExpanded
            ? 'size-10 shrink-0 [&_svg]:size-5!'
            : undefined
        }
        disabled={!player}
        aria-label='Forward 10 seconds'
        onClick={() =>
          player?.seekTo(Math.min(playback.duration, playback.time + 10), true)
        }
      >
        <ArrowClockwiseIcon />
      </Button>
      <Button
        variant='ghost'
        size='icon-sm'
        className={
          state.playerExpanded
            ? 'size-10 shrink-0 [&_svg]:size-5!'
            : undefined
        }
        disabled={!state.queue[nextIndex]}
        aria-label='Next track'
        title='Next track'
        onClick={() => {
          const next = advancePriorityQueue(state)
          if (!next) return
          player?.loadVideoById(next.currentTrack.id)
          setState(previous => ({ ...previous, ...next }))
        }}
      >
        <SkipForwardIcon weight='fill' />
      </Button>
      <Button
        size='icon-sm'
        className={
          state.playerExpanded
            ? 'size-10 shrink-0 [&_svg]:size-5!'
            : undefined
        }
        variant={state.repeatTrack ? 'secondary' : 'ghost'}
        aria-label='Loop current track'
        title='Loop current track'
        aria-pressed={state.repeatTrack}
        onClick={() =>
          setState(previous => ({
            ...previous,
            repeatTrack: !previous.repeatTrack,
          }))
        }
      >
        <RepeatOnceIcon />
      </Button>
    </div>
  )
  const timeline = (
    <div
      className={`${state.playerExpanded ? 'grid grid-cols-2' : 'flex items-center'} gap-2 text-xs text-muted-foreground tabular-nums`}
    >
      <span>{timestamp(playback.time)}</span>
      <Slider
        className={`${state.playerExpanded ? 'col-span-2 row-start-1' : ''} [&_[data-slot=slider-track]]:bg-muted-foreground/25`}
        aria-label='Seek'
        value={[playback.time]}
        max={playback.duration || 1}
        step={1}
        disabled={!player || !playback.duration}
        onValueChange={([time]) => {
          setState(previous => ({
            ...previous,
            playback: { ...previous.playback, time },
          }))
          player?.seekTo(time, true)
        }}
      />
      <span className='text-right'>{timestamp(playback.duration)}</span>
    </div>
  )
  const volumeControls = (
    <div className='flex items-center gap-2 sm:flex-1 sm:justify-end'>
      {muteButton}
      <Slider
        className={`${isMobile ? 'min-w-0 flex-1' : 'w-24'} [&_[data-slot=slider-track]]:bg-muted-foreground/25`}
        aria-label='Volume'
        value={[playback.muted ? 0 : playback.volume]}
        max={100}
        step={1}
        disabled={!player}
        onValueChange={([volume]) => {
          player?.unMute()
          player?.setVolume(volume)
          setState(previous => ({
            ...previous,
            playback: { ...previous.playback, volume, muted: false },
          }))
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            disabled={!player}
            aria-label='Playback speed'
          >
            {playback.rate}×
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={String(playback.rate)}
            onValueChange={value => player?.setPlaybackRate(Number(value))}
          >
            {playback.rates.map(rate => (
              <DropdownMenuRadioItem key={rate} value={String(rate)}>
                {rate}×
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return isMobile || state.playerExpanded ? (
    <Drawer
      open={state.playerExpanded}
      onOpenChange={playerExpanded =>
        setState(previous => ({ ...previous, playerExpanded }))
      }
    >
      <footer
        aria-label='Player'
        className='shrink-0 space-y-2 bg-sidebar px-3 py-2'
      >
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
          {playButton}
        </div>
        {timeline}
      </footer>
      <DrawerContent className='mt-0! h-dvh! max-h-dvh! overflow-y-auto p-0 before:inset-0 before:rounded-none before:border-0'>
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
          <div>
            <p className='text-xl font-semibold wrap-break-word text-foreground'>
              {track?.title ?? 'Nothing playing'}
            </p>
            <p className='mt-1 text-sm text-muted-foreground'>
              {track?.channel ??
                'Choose a track or playlist to start listening.'}
            </p>
          </div>
          {timeline}
          {controls}
          {volumeControls}
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <footer
      aria-label='Player'
      className='flex h-15 shrink-0 items-center gap-3 bg-sidebar px-2'
    >
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

      <div className='flex min-w-0 flex-[2] flex-col gap-2'>
        {controls}
        {timeline}
      </div>
      {volumeControls}
    </footer>
  )
}

import { useApp } from '@/app/tone/provider'
import { Button } from '@/components/ui/button'
import {
  advancePriorityQueue,
  createPriorityQueue,
} from '@/lib/tone/priority-queue'
import {
  PlayIcon,
  PauseIcon,
  ArrowCounterClockwiseIcon,
  ArrowClockwiseIcon,
  RepeatIcon,
  RepeatOnceIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from '@phosphor-icons/react'
export function PlayButton() {
  const { state } = useApp()
  const { player, playback } = state
  return (
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
}
export function PlayerControls() {
  const { state, setState } = useApp()
  const { player, playback } = state
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

  return (
    <div className='flex flex-wrap items-center justify-center gap-1'>
      <Button
        size='icon-sm'
        className={
          state.playerExpanded ? 'size-10 shrink-0 [&_svg]:size-5!' : undefined
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
          state.playerExpanded ? 'size-10 shrink-0 [&_svg]:size-5!' : undefined
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
          state.playerExpanded ? 'size-10 shrink-0 [&_svg]:size-5!' : undefined
        }
        disabled={!player}
        aria-label='Rewind 10 seconds'
        onClick={() => player?.seekTo(Math.max(0, playback.time - 10), true)}
      >
        <ArrowCounterClockwiseIcon />
      </Button>
      <PlayButton />
      <Button
        variant='ghost'
        size='icon-sm'
        className={
          state.playerExpanded ? 'size-10 shrink-0 [&_svg]:size-5!' : undefined
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
          state.playerExpanded ? 'size-10 shrink-0 [&_svg]:size-5!' : undefined
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
          state.playerExpanded ? 'size-10 shrink-0 [&_svg]:size-5!' : undefined
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
}

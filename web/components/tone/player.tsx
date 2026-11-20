'use client'

import { useEffect } from 'react'
import { useApp } from '@/app/tone/provider'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import {
  PlayIcon,
  PauseIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  ArrowCounterClockwiseIcon,
  ArrowClockwiseIcon,
} from '@phosphor-icons/react'

function timestamp(seconds: number) {
  const value = Math.max(0, Math.floor(seconds))
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
}

export function Player() {
  const { state, setState } = useApp()
  const { currentTrack: track, player, playback } = state

  useEffect(() => {
    if (!player) return
    let cancelled = false
    const timer = window.setInterval(async () => {
      try {
        const [time, duration, volume, muted, rate, rates] = await Promise.all([
          player.getCurrentTime(),
          player.getDuration(),
          player.getVolume(),
          player.isMuted(),
          player.getPlaybackRate(),
          player.getAvailablePlaybackRates(),
        ])
        if (!cancelled)
          setState(previous => ({
            ...previous,
            playback: {
              ...previous.playback,
              time,
              duration,
              volume,
              muted,
              rate,
              rates: [...rates],
            },
          }))
      } catch {}
    }, 500)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [player, setState])

  return (
    <footer
      aria-label='Player'
      className='flex h-20 shrink-0 items-center gap-3 bg-sidebar px-4'
    >
      <div className='hidden min-w-0 flex-1 items-center gap-3 sm:flex'>
        {track && (
          <img
            src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`}
            alt=''
            width={48}
            height={48}
            className='size-12 shrink-0 rounded-md object-cover'
          />
        )}
        <div className='min-w-0 *:text-foreground'>
          <p className='truncate text-sm font-medium'>
            {track?.title ?? 'Nothing playing'}
          </p>
          {track && (
            <p className='truncate text-xs'>
              {track.channel}
            </p>
          )}
        </div>
      </div>
      <div className='flex min-w-0 flex-[2] flex-col gap-2'>
        <div className='flex items-center justify-center gap-1'>
          <Button
            variant='ghost'
            size='icon-sm'
            disabled={!player}
            aria-label='Rewind 10 seconds'
            onClick={() =>
              player?.seekTo(Math.max(0, playback.time - 10), true)
            }
          >
            <ArrowCounterClockwiseIcon />
          </Button>
          <Button
            size='icon-sm'
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
          <Button
            variant='ghost'
            size='icon-sm'
            disabled={!player}
            aria-label='Forward 10 seconds'
            onClick={() =>
              player?.seekTo(
                Math.min(playback.duration, playback.time + 10),
                true
              )
            }
          >
            <ArrowClockwiseIcon />
          </Button>
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
        <div className='flex items-center gap-2 text-xs text-muted-foreground tabular-nums'>
          <span>{timestamp(playback.time)}</span>
          <Slider
            className='[&_[data-slot=slider-track]]:bg-muted-foreground/25'
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
          <span>{timestamp(playback.duration)}</span>
        </div>
      </div>
      <div className='flex items-center gap-2 sm:flex-1 sm:justify-end'>
        <Button
          variant='ghost'
          size='icon-sm'
          disabled={!player}
          aria-label={playback.muted ? 'Unmute' : 'Mute'}
          onClick={() => (playback.muted ? player?.unMute() : player?.mute())}
        >
          {playback.muted ? <SpeakerSlashIcon /> : <SpeakerHighIcon />}
        </Button>
        <Slider
          className='w-12 sm:w-24 [&_[data-slot=slider-track]]:bg-muted-foreground/25'
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
      </div>
    </footer>
  )
}

import { useApp } from '@/app/tone/provider'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useSidebar } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { SpeakerHighIcon, SpeakerSlashIcon } from '@phosphor-icons/react'
function timestamp(seconds: number) {
  const value = Math.max(0, Math.floor(seconds))
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
}
export function Timeline() {
  const { state, setState } = useApp()
  const { player, playback } = state
  return (
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
}
export function VolumeControls() {
  const { state, setState } = useApp()
  const { player, playback } = state
  const { isMobile } = useSidebar()
  const muteButton = (
    <Button
      variant='ghost'
      size='icon-sm'
      className={
        state.playerExpanded ? 'size-10 shrink-0 [&_svg]:size-5!' : undefined
      }
      disabled={!player}
      aria-label={playback.muted ? 'Unmute' : 'Mute'}
      onClick={() => (playback.muted ? player?.unMute() : player?.mute())}
    >
      {playback.muted ? <SpeakerSlashIcon /> : <SpeakerHighIcon />}
    </Button>
  )
  return (
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
}

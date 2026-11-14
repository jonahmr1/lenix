'use client'
import {
  MusicNotesIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

export function PlaybackBar() {
  return (
    <footer
      aria-label="Playback"
      className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-muted p-3">
          <MusicNotesIcon aria-hidden="true" className="size-5" />
        </div>
        <p className="text-sm text-muted-foreground">Nothing playing</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          disabled
          variant="ghost"
          className="size-11"
          aria-label="Previous track"
        >
          <SkipBackIcon aria-hidden="true" />
        </Button>
        <Button disabled className="size-11 rounded-full" aria-label="Play">
          <PlayIcon aria-hidden="true" weight="fill" />
        </Button>
        <Button
          disabled
          variant="ghost"
          className="size-11"
          aria-label="Next track"
        >
          <SkipForwardIcon aria-hidden="true" />
        </Button>
      </div>
    </footer>
  )
}

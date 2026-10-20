'use client'

import { Slider } from '@/components/ui/slider'
import { Button } from '../ui/button'
import {
  ArrowClockwiseIcon,
  FastForwardIcon,
  PlusIcon,
  RewindIcon,
  SkipBackIcon,
  SkipForwardIcon,
  SparkleIcon,
  SpeakerSimpleHighIcon,
  SpeakerSimpleLowIcon,
  SpeakerSimpleNoneIcon,
  SpeakerSimpleSlashIcon,
} from '@phosphor-icons/react'
import { PauseIcon, PlayIcon } from '@phosphor-icons/react'
import he from 'he'
import YouTube from 'react-youtube'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { ButtonGroup } from '../ui/button-group'
import { Thumbnail } from '../thumbnail'
import Link from 'next/link'
import { Live } from './live'
import { toast } from 'sonner'
import { useStates } from '@/hooks/useStates'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Marquee } from '../ui/marquee'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { createClient } from '@/lib/supabase.client'
import { asserts } from '@lenix/lenix'
import { ShimmerButton } from '../ui/shimmer-button'
import { useTheme } from 'next-themes'

dayjs.extend(duration)

const format = (value: number) =>
  dayjs.duration(value, 'seconds').format('m:ss')

export const Player = () => {
  const {
    states,
    setStates,
    seek,
    setPlaying,
    togglePlay,
    toggleMute,
    setVolume,
    play,
  } = useStates()
  const { resolvedTheme } = useTheme()

  const videoId = states.video?.id.videoId

  const video = states.video?.snippet
  const thumbnail = video?.thumbnails.high.url

  const PlaybackIcon = states.isPlaying
    ? PauseIcon
    : states.currentTime.toFixed(0) === states.duration.toFixed(0) &&
        states.duration > 0
      ? ArrowClockwiseIcon
      : PlayIcon
  const playerButtons = [
    {
      onClick: () => seek(Math.max(0, states.currentTime - 5)),
      children: <RewindIcon />,
    },
    {
      onClick: null,
      children: <SkipBackIcon weight="fill" />,
    },
    {
      onClick: togglePlay,
      children: <PlaybackIcon weight="fill" />,
    },
    {
      onClick: null,
      children: <SkipForwardIcon weight="fill" />,
    },
    {
      onClick: () => seek(Math.max(0, states.currentTime + 5)),
      children: <FastForwardIcon />,
    },
  ]

  const VolumeIcon = states.isMuted
    ? SpeakerSimpleSlashIcon
    : states.volume === 0
      ? SpeakerSimpleNoneIcon
      : (states.volume ?? 0 < 50)
        ? SpeakerSimpleLowIcon
        : SpeakerSimpleHighIcon

  return (
    <>
      <div className="absolute bottom-[3vh] left-1/2 flex w-[70vw] -translate-x-1/2 items-center gap-[2vw] rounded-full bg-muted px-[3vh] portrait:w-full portrait:flex-col portrait:items-stretch portrait:rounded-none portrait:px-[5vw] portrait:py-[3vh]">
        <ButtonGroup className="*:size-10vh! w-full flex-1 portrait:order-1 portrait:justify-center">
          {playerButtons.map((button, i) => (
            <Button
              key={i}
              className="size-10vh!"
              variant="outline"
              size="icon-lg"
              disabled={
                !states.ytPlayer ||
                !videoId ||
                !button.onClick ||
                (video?.liveBroadcastContent !== 'none' &&
                  button.onClick !== togglePlay) ||
                !states.duration
              }
              onClick={() => button.onClick?.()}
            >
              {button.children}
            </Button>
          ))}
        </ButtonGroup>
        <div className="order-0 flex size-full min-w-0 flex-2 flex-col gap-[0.5vh] pt-[1vh] pb-[0.5vh] **:leading-none">
          <div className="flex size-full items-center gap-[1vw]">
            <Thumbnail src={thumbnail} className="rounded-none" />
            <div className="flex w-full flex-col gap-[0.5vh] overflow-hidden *:tracking-wide">
              <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                  <Marquee speed={10} className="font-bold text-foreground">
                    {video ? he.decode(video.title) : 'Not Playing'}
                  </Marquee>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-background">
                    {dayjs(video?.publishedAt).format('MMMM D, YYYY')}
                  </p>
                </TooltipContent>
              </Tooltip>
              {video && (
                <Link
                  className="text-xs font-normal no-underline hover:underline"
                  href={`https://www.youtube.com/channel/${video?.channelId}`}
                  target="_blank"
                >
                  {he.decode(video.channelTitle)}
                </Link>
              )}
            </div>
            {video && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon">
                    <PlusIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Smart Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Tooltip delayDuration={700}>
                        <TooltipTrigger asChild>
                          <ShimmerButton
                            className="flex w-full justify-evenly rounded-xl py-1 text-background"
                            borderRadius="var(--radius-md)"
                            shimmerColor="var(--background)"
                            background={
                              resolvedTheme === 'dark'
                                ? 'var(--chart-1)'
                                : 'var(--chart-5)'
                            }
                          >
                            <SparkleIcon />
                            Auto-Place
                            <span className="rounded-md px-1 py-[0.1vh] text-xs text-background outline outline-background">
                              AI
                            </span>
                          </ShimmerButton>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>
                            AI add it to a matching playlist or creates a new
                            one.
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Add to playlist</DropdownMenuLabel>
                    {states.playlists?.map(playlist => (
                      <DropdownMenuCheckboxItem
                        key={playlist.id}
                        onSelect={e => e.preventDefault()}
                        checked={
                          videoId ? playlist.tracks.includes(videoId) : false
                        }
                        onCheckedChange={checked => {
                          asserts(videoId)

                          const tracks = checked
                            ? [...playlist.tracks, videoId]
                            : playlist.tracks.filter(self => self !== videoId)

                          toast.promise(
                            async () => {
                              const { error, data } = await createClient()
                                .from('playlists')
                                .update({ tracks })
                                .eq('id', playlist.id)
                                .select()
                                .single()

                              if (error) throw error

                              setStates(prev => ({
                                ...prev,
                                playlists:
                                  prev.playlists?.map(p =>
                                    p.id === data.id ? data : p
                                  ) ?? null,
                              }))
                            },
                            {
                              loading: checked ? 'Removing...' : 'Adding...',
                              error: error => ({
                                message: 'Error',
                                description: JSON.stringify(error),
                              }),
                              success: checked
                                ? 'Added to playlist.'
                                : 'Removed from playlist.',
                            }
                          )
                        }}
                      >
                        {playlist.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="flex w-full items-center gap-[0.5vw] text-xs">
            <p className="leading-none whitespace-nowrap text-foreground">
              {states.duration ? format(states.currentTime) : '--:--'}
            </p>
            <Slider
              value={[states.currentTime]}
              onValueChange={values => seek(values[0])}
              max={states.duration || 1}
              disabled={
                !states.duration ||
                (video ? video.liveBroadcastContent !== 'none' : true)
              }
              className="test **:data-[slot=slider-track]:bg-foreground/20"
            />
            <div className="leading-none">
              {video && states.duration ? (
                video.liveBroadcastContent !== 'none' ? (
                  <Live>{video?.liveBroadcastContent}</Live>
                ) : (
                  format(states.duration)
                )
              ) : (
                <span className="flex truncate">--:--</span>
              )}
            </div>
          </div>
        </div>
        <div className="order-1 flex flex-1 justify-end gap-[2vw] portrait:justify-start">
          <Slider
            defaultValue={[states.volume]}
            onValueChange={values => setVolume(values[0])}
            className="w-1/2 **:data-[slot=slider-track]:bg-foreground/20 portrait:w-full"
          />
          <Button
            size="icon-lg"
            variant="outline"
            className="rounded-full *:size-full"
            onClick={toggleMute}
          >
            <VolumeIcon />
          </Button>
        </div>
      </div>
      {videoId && (
        <YouTube
          videoId={videoId}
          onReady={async e => {
            if (!states.autoplay) {
              await e.target.cueVideoById({
                videoId,
                startSeconds: states.currentTime,
              })
            }
            await e.target.setVolume(states.volume)

            setStates(prev => ({ ...prev, ytPlayer: e.target }))
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnd={() => {
            setPlaying(false)
            const queue = states.queue?.slice(1)
            if (queue?.length) {
              setStates(prev => ({ ...prev, queue }))
              play(queue[0])
            }
          }}
          onStateChange={async state => {
            const duration = await state.target.getDuration()
            setStates(prev => ({ ...prev, duration }))
          }}
          opts={{ playerVars: { autoplay: states.autoplay ? 1 : 0 } }}
          iframeClassName="absolute min-w-50 min-h-50 pointer-events-none"
          onError={e => {
            setPlaying(false)
            toast.error(
              'This video cannot play here. Please choose another music.',
              {
                description: JSON.stringify(e.data),
              }
            )
          }}
        />
      )}
    </>
  )
}

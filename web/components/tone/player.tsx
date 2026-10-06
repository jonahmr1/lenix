import { Slider } from '@/components/ui/slider'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
	FastForwardIcon,
	RewindIcon,
	SkipBackIcon,
	SkipForwardIcon,
	SpeakerSimpleHighIcon,
	SpeakerSimpleLowIcon,
	SpeakerSimpleNoneIcon,
	SpeakerSimpleSlashIcon,
} from '@phosphor-icons/react'
import { PauseIcon, PlayIcon } from '@phosphor-icons/react'
import he from 'he'
import YouTube, { type YouTubePlayer } from 'react-youtube'
import { YoutubeVideoSearch } from 'youtube.ts/dist/types'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { ButtonGroup } from '../ui/button-group'
import { Thumbnail } from '../thumbnail'
import { Skeleton } from '../ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import Link from 'next/link'
import { usePlayer } from '@/hooks/usePlayer'
import { Live } from './live'

dayjs.extend(duration)

const format = (value: number) => dayjs.duration(value, 'seconds').format('m:ss')


export const Player = ({
	selectedVideo,
}: {
	selectedVideo: YoutubeVideoSearch['items'][number] | null
}) => {
	const videoId = selectedVideo?.id.videoId
	const [ytPlayer, setYtPlayer] = useState<YouTubePlayer | null>(null)
	const player = usePlayer(ytPlayer, videoId)
	if (!player) return null

	const video = selectedVideo?.snippet
	const thumbnail = video?.thumbnails.high.url
	const PlaybackIcon = player.isPlaying ? PauseIcon : PlayIcon
	const VolumeIcon = player.isMuted
		? SpeakerSimpleSlashIcon
		: player.volume === 0
			? SpeakerSimpleNoneIcon
			: player.volume < 50
				? SpeakerSimpleLowIcon
				: SpeakerSimpleHighIcon

	const onStop = () => player.setPlaying(false)

	const playerButtons = [
		{
			onClick: () => player.seek([Math.max(0, player.currentTime - 5)]),
			children: <RewindIcon />,
		},
		{
			onClick: null,
			children: <SkipBackIcon weight='fill' />,
		},
		{
			onClick: player.togglePlay,
			children: <PlaybackIcon weight="fill" />,
		},
		{
			onClick: null,
			children: <SkipForwardIcon weight="fill" />,
		},
		{
			onClick: () => player.seek([Math.max(0, player.currentTime + 5)]),
			children: <FastForwardIcon />,
		},
	]

	return (
		<>
			<div className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 flex items-center w-[50vw] bg-muted rounded-full px-[1vh] py-[0.5vh]">
				<div className="flex-1 size-full flex items-center gap-[0.5vw]">
					<Dialog>
						<DialogTrigger disabled={!video} className={video ? 'cursor-pointer' : 'cursor-not-allowed'}>
							<Thumbnail src={thumbnail} />
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>
									<p>{video?.title}</p>
									<p className='font-thin'>{dayjs(video?.publishedAt).format("MMMM D, YYYY")}</p>
								</DialogTitle>
								<DialogDescription>
									<Link href={`https://www.youtube.com/channel/${video?.channelId}`} target='_blank'>
										{video?.channelTitle}
									</Link> 
								</DialogDescription>
							</DialogHeader>
							{video?.description}
						</DialogContent>
					</Dialog>
					<div className="*:text-foreground w-2/3 *:tracking-wide text-[0.8vw] font-light">
						{video?.title && video?.channelTitle ? <>
							<p className="font-bold">{he.decode(video.title)}</p>
							<p>{he.decode(video.channelTitle)}</p>
						</> : <div className='flex flex-col gap-[0.5vh]'>
							<Skeleton className='w-full h-[2vh] bg-ring' />
							<Skeleton className='w-2/3 h-[2vh] bg-ring' />
						</div>}
					</div>
				</div>
				<div className='flex-1 flex flex-col items-center'>
					<ButtonGroup className='*:size-10vh!'>
						{playerButtons.map((button, i) => (
							<Button
								key={i}
								className="size-10vh!"
								variant="outline"
								disabled={!videoId || !button.onClick || video?.liveBroadcastContent !== 'none' && button.onClick !== player.togglePlay}
								onClick={() => button.onClick?.()}
							>
								{button.children}
							</Button>
						))}
					</ButtonGroup>
					<div className='flex gap-[0.5vw] w-full'>
						<p>{format(player.currentTime)}</p>
						<Slider
							value={[player.currentTime]}
							onValueChange={player.seek}
							max={player.duration || 1}
							disabled={!player.duration || !!video?.liveBroadcastContent}
							className='**:data-[slot=slider-track]:bg-foreground/20'
						/>
						<div>
							{video?.liveBroadcastContent && video.liveBroadcastContent !== 'none' ? (
								<Live>{video?.liveBroadcastContent}</Live>
							) : format(player.duration)}
						</div>
					</div>
				</div>
				<div className="flex-1 flex justify-end">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="icon-lg"
								variant="outline"
								className="*:size-full rounded-full"
								onClick={player.toggleMute}
							>
								<VolumeIcon />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<Slider
								orientation="vertical"
								defaultValue={[player.volume]}
								onValueChange={player.setVolume}
								className="invert **:data-[slot=slider-track]:bg-foreground/20"
							/>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
			{videoId && (
				<YouTube
					videoId={videoId}
						onReady={(e) => {
							setYtPlayer(e.target)
							void e.target.setVolume(player.volume)
						}}
						onPlay={() => player.setPlaying(true)}
						onPause={onStop}
						onEnd={onStop}
						opts={{ playerVars: { autoplay: 1 } }}
						iframeClassName="absolute -top-full min-w-50 min-h-50 pointer-events-none"
				/>
			)}
		</>
	)
}

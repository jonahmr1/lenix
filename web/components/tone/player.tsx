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
import { S } from '@lenix/lenix'
import { cn } from 'cn'
import { toast } from 'sonner'

dayjs.extend(duration)

const format = (value: number) => dayjs.duration(value, 'seconds').format('m:ss')

const Body = ({ children, className, ...props }: {
	children: React.ReactNode
	className?: string
} & React.ComponentProps<'div'>) => (
	<div
		className={cn(
			'absolute bottom-[3vh] left-1/2 -translate-x-1/2 flex items-center w-[50vw] bg-muted rounded-full px-[1vh] py-[0.5vh]',
			className
		)}
		{...props}
	>
		{children}
	</div>
)

export const Player = ({
	selectedVideo,
	player,
	setYtPlayer
}: {
	selectedVideo: YoutubeVideoSearch['items'][number] | null
	player: ReturnType<typeof usePlayer>
	setYtPlayer: S<YouTubePlayer | null>
}) => {
	const videoId = selectedVideo?.id.videoId

	const video = selectedVideo?.snippet
	const thumbnail = video?.thumbnails.high.url

	const PlaybackIcon = player?.isPlaying ? PauseIcon : PlayIcon
	const playerButtons = [
		{
			onClick: () => player?.seek([Math.max(0, player.currentTime - 5)]),
			children: <RewindIcon />,
		},
		{
			onClick: null,
			children: <SkipBackIcon weight='fill' />,
		},
		{
			onClick: player?.togglePlay,
			children: <PlaybackIcon weight="fill" />,
		},
		{
			onClick: null,
			children: <SkipForwardIcon weight="fill" />,
		},
		{
			onClick: () => player?.seek([Math.max(0, player.currentTime + 5)]),
			children: <FastForwardIcon />,
		},
	]

	const VolumeIcon = player?.isMuted
		? SpeakerSimpleSlashIcon
		: player?.volume === 0
			? SpeakerSimpleNoneIcon
			: player?.volume ?? 0 < 50
				? SpeakerSimpleLowIcon
				: SpeakerSimpleHighIcon

	if (!player || !video) return (
		<Body>
			<div className="flex-1 size-full flex items-center gap-[0.5vw]">
				<Dialog>
					<DialogTrigger disabled className='cursor-not-allowed'>
						<Thumbnail src={thumbnail} />
					</DialogTrigger>
					<DialogContent>
					</DialogContent>
				</Dialog>
				<div className="*:text-foreground w-2/3 *:tracking-wide text-[0.8vw] font-light">
					<div className='flex flex-col gap-[0.5vh]'>
						<Skeleton className='w-full h-[2vh] bg-ring' />
						<Skeleton className='w-2/3 h-[2vh] bg-ring' />
					</div>
				</div>
			</div>
			<div className='flex-1 flex flex-col items-center'>
				<ButtonGroup className='*:size-10vh!'>
					{playerButtons.map((button, i) => (
						<Button
							key={i}
							className="size-10vh!"
							variant="outline"
							disabled
						>
							{button.children}
						</Button>
					))}
				</ButtonGroup>
				<div className='flex gap-[0.5vw] w-full items-center'>
					<span className='whitespace-nowrap'>--</span>
					<Slider
						value={[0]}
						disabled
						className='**:data-[slot=slider-track]:bg-foreground/20'
					/>
					<div className='whitespace-nowrap'>
						{video?.liveBroadcastContent && video.liveBroadcastContent !== 'none' ? (
							<Live>{video?.liveBroadcastContent}</Live>
						) : '--'}
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
						>
							<VolumeIcon />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<Slider
							orientation="vertical"
							defaultValue={[0]}
							className="invert **:data-[slot=slider-track]:bg-foreground/20"
						/>
					</TooltipContent>
				</Tooltip>
			</div>
		</Body>
	)

	const onStop = () => player.setPlaying(false)

	return (
		<>
			<Body>
				<div className="flex-1 size-full flex items-center gap-[0.5vw]">
					<Dialog>
						<DialogTrigger className='cursor-pointer'>
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
						<p className="font-bold">{he.decode(video.title)}</p>
						<p>{he.decode(video.channelTitle)}</p>
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
						<p className='text-foreground'>{format(player.currentTime)}</p>
						<Slider
							value={[player.currentTime]}
							onValueChange={player.seek}
							max={player.duration || 1}
							disabled={!player.duration || video.liveBroadcastContent !== 'none'}
							className='**:data-[slot=slider-track]:bg-foreground/20'
						/>
						<div>
							{video.liveBroadcastContent !== 'none' ? (
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
			</Body>
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
						opts={{ playerVars: { autoplay: 0 } }}
						iframeClassName="absolute -top-full min-w-50 min-h-50 pointer-events-none"
						onError={() => {
							player.setPlaying(false)
							toast.error('This video cannot play here. Please choose another music.')
						}}
				/>
			)}
		</>
	)
}

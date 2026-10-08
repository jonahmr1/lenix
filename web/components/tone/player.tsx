import { Slider } from '@/components/ui/slider'
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
import YouTube from 'react-youtube'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { ButtonGroup } from '../ui/button-group'
import { Thumbnail } from '../thumbnail'
import { Skeleton } from '../ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import Link from 'next/link'
import { Live } from './live'
import { cn } from 'cn'
import { toast } from 'sonner'
import { useStates } from '@/hooks/useStates'

dayjs.extend(duration)

const format = (value: number) => dayjs.duration(value, 'seconds').format('m:ss')

const Body = ({ children, className, ...props }: {
	children: React.ReactNode
	className?: string
} & React.ComponentProps<'div'>) => (
	<div
		className={cn(
			'absolute bottom-[3vh] left-1/2 -translate-x-1/2 flex items-center w-[67vw] bg-muted rounded-full px-[1vh] py-[0.5vh] portrait:flex-col portrait:rounded-none portrait:gap-[1vh] portrait:w-full portrait:items-stretch portrait:px-[5vw] portrait:py-[3vh]',
			className
		)}
		{...props}
	>
		{children}
	</div>
)

export const Player = () => {
	const { states, setStates, seek, setPlaying, togglePlay, toggleMute, setVolume } = useStates()
	
	const videoId = states.video?.id.videoId

	const video = states.video?.snippet
	const thumbnail = video?.thumbnails.high.url

	const PlaybackIcon = states.isPlaying ? PauseIcon : PlayIcon
	const playerButtons = [
		{
			onClick: () => seek(Math.max(0, states.currentTime - 5)),
			children: <RewindIcon />,
		},
		{
			onClick: null,
			children: <SkipBackIcon weight='fill' />,
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
			: states.volume ?? 0 < 50
				? SpeakerSimpleLowIcon
				: SpeakerSimpleHighIcon

	if (!video) return (
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
					<span className='whitespace-nowrap'>--</span>
				</div>
			</div>
			<div className="flex-1 flex justify-end portrait:justify-start gap-[1vw]">
				<Slider
					defaultValue={[0]}
					className="w-1/2 portrait:w-full **:data-[slot=slider-track]:bg-foreground/20"
				/>
				<Button
					size="icon-lg"
					variant="outline"
					className="*:size-full rounded-full"
				>
					<VolumeIcon />
				</Button>
			</div>
		</Body>
	)

	return (
		<>
			<Body>
				<div className="flex-1 size-full flex items-center gap-[1vw]">
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
					<div className="*:text-foreground w-2/3 *:tracking-wide text-sm">
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
								disabled={
									!states.ytPlayer ||
									!videoId ||
									!button.onClick ||
									video?.liveBroadcastContent !== 'none' && button.onClick !== togglePlay
								}
								onClick={() => button.onClick?.()}
							>
								{button.children}
							</Button>
						))}
					</ButtonGroup>
					<div className='flex gap-[0.5vw] w-full'>
						<p className='text-foreground'>{format(states.currentTime)}</p>
						<Slider
							value={[states.currentTime]}
							onValueChange={values => seek(values[0])}
							max={states.duration || 1}
							disabled={!states.duration || video.liveBroadcastContent !== 'none'}
							className='**:data-[slot=slider-track]:bg-foreground/20'
						/>
						<div>
							{video.liveBroadcastContent !== 'none' ? (
								<Live>{video?.liveBroadcastContent}</Live>
							) : format(states.duration)}
						</div>
					</div>
				</div>
				<div className="flex-1 flex justify-end portrait:justify-start gap-[2vw]">
					<Slider
						defaultValue={[states.volume]}
						onValueChange={values => setVolume(values[0])}
						className="w-1/2 portrait:w-full **:data-[slot=slider-track]:bg-foreground/20"
					/>
					<Button
						size="icon-lg"
						variant="outline"
						className="*:size-full rounded-full"
						onClick={toggleMute}
					>
						<VolumeIcon />
					</Button>
				</div>
			</Body>
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
						onEnd={() => setPlaying(false)}
						onStateChange={async state => {
							const duration = await state.target.getDuration()
							setStates(prev => ({ ...prev, duration }))
						}}
						opts={{ playerVars: { autoplay: states.autoplay ? 1 : 0 } }}
						iframeClassName="absolute -top-full min-w-50 min-h-50 pointer-events-none"
						onError={e => {
							setPlaying(false)
							toast.error('This video cannot play here. Please choose another music.', {
								description: JSON.stringify(e.data)
							})
						}}
				/>
			)}
		</>
	)
}

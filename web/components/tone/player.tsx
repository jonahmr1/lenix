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
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { createClient } from '@/lib/supabase.client'
import { asserts } from '@lenix/lenix'
import { ShimmerButton } from '../ui/shimmer-button'
import { useTheme } from 'next-themes'

dayjs.extend(duration)

const format = (value: number) => dayjs.duration(value, 'seconds').format('m:ss')

export const Player = () => {
	const { states, setStates, seek, setPlaying, togglePlay, toggleMute, setVolume } = useStates()
	const { resolvedTheme } = useTheme()
	
	const videoId = states.video?.id.videoId

	const video = states.video?.snippet
	const thumbnail = video?.thumbnails.high.url

	const PlaybackIcon = states.isPlaying ? PauseIcon : states.currentTime.toFixed(0) === states.duration.toFixed(0) && states.duration > 0 ? ArrowClockwiseIcon : PlayIcon
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

	return (
		<>
			<div className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 flex items-center w-[70vw] bg-muted rounded-full px-[3vh] portrait:flex-col portrait:rounded-none gap-[2vw] portrait:w-full portrait:items-stretch portrait:px-[5vw] portrait:py-[3vh]">
				<ButtonGroup className="flex-1 *:size-10vh! portrait:order-1 w-full portrait:justify-center">
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
				<div className="flex-2 min-w-0 size-full pt-[1vh] pb-[0.5vh] flex flex-col gap-[0.5vh] order-0 **:leading-none">
					<div className="size-full flex items-center gap-[1vw]">
						<Thumbnail src={thumbnail} className="rounded-none" />
						<div className="w-full *:tracking-wide flex flex-col gap-[0.5vh] overflow-hidden">
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
								<DropdownMenuContent side='top'>
									<DropdownMenuGroup>
										<DropdownMenuLabel>Smart Actions</DropdownMenuLabel>
										<DropdownMenuItem asChild>
											<Tooltip delayDuration={700}>
												<TooltipTrigger asChild>
													<ShimmerButton
														className='w-full flex justify-evenly text-background py-1 rounded-xl' borderRadius='var(--radius-md)'
														shimmerColor='var(--background)'
														background={resolvedTheme === 'dark' ? 'var(--chart-1)' : 'var(--chart-5)'}
													>
														<SparkleIcon />
														Auto-Place
														<span className='text-background text-xs px-1 py-[0.1vh] rounded-md outline outline-background'>AI</span>
													</ShimmerButton>
												</TooltipTrigger>
												<TooltipContent>
													<span>AI picks a matching playlist or creates a new one.</span>
												</TooltipContent>
											</Tooltip>
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuLabel>Add to playlist</DropdownMenuLabel>
										{states.playlists?.map((playlist) => (
											<DropdownMenuCheckboxItem
												key={playlist.id}
												onSelect={(e) => e.preventDefault()}
												checked={videoId ? playlist.tracks.includes(videoId) : false}
												onCheckedChange={(checked) => {
													asserts(videoId)

													const tracks = checked
														? [...playlist.tracks, videoId]
														: playlist.tracks.filter((self) => self !== videoId)

													toast.promise(
														async () => {
															const { error, data } = await createClient()
																.from('playlists')
																.update({ tracks })
																.eq('id', playlist.id)
																.select()
																.single()

															if (error) throw error

															setStates((prev) => ({
																...prev,
																playlists:
																	prev.playlists?.map((p) => (p.id === data.id ? data : p)) ??
																	null,
															}))
														},
														{
															loading: checked ? 'Removing...' : 'Adding...',
															error: (error) => ({
																message: 'Error',
																description: JSON.stringify(error),
															}),
															success: checked
																? 'Added to playlist.'
																: 'Removed from playlist.',
														},
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
					<div className="flex gap-[0.5vw] w-full items-center text-xs">
						<p className="text-foreground whitespace-nowrap leading-none">
							{states.duration ? format(states.currentTime) : '--:--'}
						</p>
						<Slider
							value={[states.currentTime]}
							onValueChange={(values) => seek(values[0])}
							max={states.duration || 1}
							disabled={
								!states.duration ||
								(video ? video.liveBroadcastContent !== 'none' : true)
							}
							className="**:data-[slot=slider-track]:bg-foreground/20 test"
						/>
						<div className="leading-none">
							{video && states.duration ? (
								video.liveBroadcastContent !== 'none' ? (
									<Live>{video?.liveBroadcastContent}</Live>
								) : (
									format(states.duration)
								)
							) : (
								<span className="truncate flex">--:--</span>
							)}
						</div>
					</div>
				</div>
				<div className="flex-1 flex justify-end portrait:justify-start gap-[2vw] order-1">
					<Slider
						defaultValue={[states.volume]}
						onValueChange={(values) => setVolume(values[0])}
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
			</div>
			{videoId && (
				<YouTube
					videoId={videoId}
					onReady={async (e) => {
						if (!states.autoplay) {
							await e.target.cueVideoById({
								videoId,
								startSeconds: states.currentTime,
							})
						}
						await e.target.setVolume(states.volume)

						setStates((prev) => ({ ...prev, ytPlayer: e.target }))
					}}
					onPlay={() => setPlaying(true)}
					onPause={() => setPlaying(false)}
					onEnd={() => setPlaying(false)}
					onStateChange={async (state) => {
						const duration = await state.target.getDuration()
						setStates((prev) => ({ ...prev, duration }))
					}}
					opts={{ playerVars: { autoplay: states.autoplay ? 1 : 0 } }}
					iframeClassName="absolute min-w-50 min-h-50 pointer-events-none"
					onError={(e) => {
						setPlaying(false)
						toast.error('This video cannot play here. Please choose another music.', {
							description: JSON.stringify(e.data),
						})
					}}
				/>
			)}
		</>
	)
}

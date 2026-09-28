import { Slider } from '@/components/ui/slider'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
	SpeakerSimpleHighIcon,
	SpeakerSimpleLowIcon,
	SpeakerSimpleNoneIcon,
	SpeakerSimpleSlashIcon,
} from '@phosphor-icons/react'
import { S, storage } from '@lenix/lenix'
import { PauseIcon, PlayIcon, SmileySadIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import he from 'he'
import YouTube, { type YouTubePlayer } from 'react-youtube'
import { YoutubeVideoSearch } from 'youtube.ts/dist/types'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const format = (value: number) => dayjs.duration(value, 'seconds').format('m:ss')

const usePlayer = (
	player: YouTubePlayer | null,
	videoId: string | undefined,
) => {
	const [state, setState] = useState<{
		volume: number
		isMuted: boolean
		isPlaying: boolean
	currentTime: number
	duration: number
	} | null>(null)

	const isPlaying = state?.isPlaying ?? false

	useEffect(() => {
		const storedVolume = storage.get<{ volume: number }, 'volume'>('volume')
		const storageIsMuted = storage.get<{ isMuted: boolean }, 'isMuted'>('isMuted')

		setState({
			volume: storedVolume === null ? 20 : Number(storedVolume),
			isMuted: storageIsMuted === null ? false : storageIsMuted === 'true',
			isPlaying: false,
			currentTime: 0,
			duration: 0,
		})
	}, [])
	useEffect(() => {
		setState((prev) =>
			prev ? { ...prev, currentTime: 0, duration: 0 } : prev,
		)
	}, [videoId])

	useEffect(() => {
		if (!player || !isPlaying) return

		let active = true
		const updateTime = async () => {
			try {
				const [currentTime, duration] = await Promise.all([
					player.getCurrentTime(),
					player.getDuration(),
				])
				if (active) {
					setState((prev) =>
						prev
							? {
								...prev,
								duration,
								currentTime,
							}
							: prev,
					)
				}
			} catch {
				// Player may be replaced while a request is in flight.
			}
		}

		void updateTime()
		const interval = setInterval(() => void updateTime(), 500)
		return () => {
			active = false
			clearInterval(interval)
		}
	}, [player, isPlaying])

	useEffect(() => {
		if (!state) return

		storage.set<{ volume: number }, 'volume'>('volume', state.volume)
	}, [state?.volume])

	if (!state) return null

	return {
		isPlaying,
		volume: state.volume,
		isMuted: state.isMuted,
		setVolume: (volume: number[]) => {
			setState((prev) => (prev ? { ...prev, volume: volume[0] } : prev))
			player?.setVolume(volume[0])
		},
		setPlaying: (isPlaying: boolean) => {
			setState((prev) => (prev ? { ...prev, isPlaying } : prev))
			if (isPlaying) {
				if (state.isMuted) player?.mute()
				else player?.unMute()
			}
		},
		seek: (time: number[]) => {
			setState((prev) => (prev ? { ...prev, currentTime: time[0] } : prev))
			player?.seekTo(time[0], true)
		},
		toggleMute: async () => {
			const isMuted = !state.isMuted
			setState((prev) => (prev ? { ...prev, isMuted } : prev))
			storage.set<{ isMuted: boolean }, 'isMuted'>('isMuted', isMuted)
			if (isMuted) await player?.mute()
			else await player?.unMute()
		},
		togglePlay: () => (isPlaying ? player?.pauseVideo() : player?.playVideo()),
		currentTime: state.currentTime,
		duration: state.duration,
	}
}

export const Player = ({
	player: ytPlayer,
	selectedVideo,
	setPlayer,
}: {
	player: YouTubePlayer | null
	selectedVideo: YoutubeVideoSearch['items'][number] | null
	setPlayer: S<YouTubePlayer | null>
}) => {
	const videoId = selectedVideo?.id.videoId
	const player = usePlayer(ytPlayer, videoId)
	if (!player) return null

	const video = selectedVideo?.snippet
	const thumbnail = video?.thumbnails.high.url ?? 'https://lenix.dev/favicon.svg'
	const PlaybackIcon = player.isPlaying ? PauseIcon : PlayIcon
	const VolumeIcon = player.isMuted
		? SpeakerSimpleSlashIcon
		: player.volume === 0
			? SpeakerSimpleNoneIcon
			: player.volume < 50
				? SpeakerSimpleLowIcon
				: SpeakerSimpleHighIcon

	const onStop = () => player.setPlaying(false)

	return (
		<>
			<div className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 flex items-center w-[50vw] bg-foreground/10 rounded-full px-[1vh] py-[0.5vh]">
				<div className="flex-1 size-full flex items-center gap-[0.5vw]">
					<Avatar size="lg" className="after:border-0 overflow-hidden">
						<AvatarImage className=" scale-135" src={thumbnail} />
						<AvatarFallback>
							<SmileySadIcon className="size-2/3 text-destructive" />
						</AvatarFallback>
					</Avatar>
					{video && (
						<div className="*:text-foreground *:tracking-wide text-[0.8vw] font-light">
							<p className="font-bold">{he.decode(video.title)}</p>
							<p>{he.decode(video.channelTitle)}</p>
						</div>
					)}
				</div>
				<div className='flex-1 flex flex-col'>
					<Button
						className="size-10vh!"
						variant="outline"
						disabled={!videoId}
						onClick={player.togglePlay}
					>
						<PlaybackIcon weight="fill" />
					</Button>
					<div className='flex gap-[0.5vw]'>
						<p>{format(player.currentTime)}</p>
						{videoId && (
							<Slider
								value={[player.currentTime]}
								onValueChange={player.seek}
								max={player.duration || 1}
								disabled={!player.duration}
								className='**:data-[slot=slider-track]:bg-foreground/20'
							/>
						)}
						<p>{format(player.duration)}</p>
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
							setPlayer(e.target)
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

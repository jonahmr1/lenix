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
import { Progress } from '@/components/ui/progress'
import YouTube, { type YouTubePlayer } from 'react-youtube'
import { YoutubeVideoSearch } from 'youtube.ts/dist/types'

interface Volume {
	value: number
	isMuted: boolean
}

export const Player = ({ player, selectedVideo, setPlayer }: {
	player: YouTubePlayer | null
	selectedVideo: YoutubeVideoSearch['items'][number] | null
	setPlayer: S<YouTubePlayer | null>
}) => {
	const [isPlaying, setPlaying] = useState(false)
	const [volume, setVolume] = useState<Volume>()

	useEffect(() => {
		if (!volume) {
			const value = storage.get<Volume, 'value'>('value')
			const isMuted = storage.get<Volume, 'isMuted'>('isMuted')
			setVolume({
				value: value === null ? 20 : Number(value),
				isMuted: isMuted === null ? false : isMuted === 'true',
			})
			return
		}

		player?.setVolume(volume.isMuted ? 0 : volume.value)

		let last = volume
		const timeout = setTimeout(() => {
			if (last !== volume) return

			storage.set<Volume, 'value'>('value', volume.value)
			storage.set<Volume, 'isMuted'>('isMuted', volume.isMuted)
		}, 1000)

		return () => clearTimeout(timeout)
	}, [volume, player])

	if (!volume) return null

	return <>
		<div className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 flex items-center w-[50vw] bg-foreground/10 rounded-full px-[1vh] py-[0.5vh]">
			<div className="flex-1 size-full flex justify-start ">
				<Button
					className="size-10vh!"
					variant="ghost"
					disabled={!selectedVideo || !player}
					onClick={() => (isPlaying ? player?.pauseVideo() : player?.playVideo())}
				>
					{isPlaying ? <PauseIcon weight="fill" /> : <PlayIcon weight="fill" />}
				</Button>
			</div>
			<div className="flex flex-col flex-3">
				<div className={`flex gap-[0.5vw] ${!selectedVideo && 'justify-center'}`}>
					<Avatar size="lg" className="after:border-0 rounded-md overflow-hidden">
						<AvatarImage
							className="rounded-md scale-135"
							src={
								selectedVideo
									? selectedVideo.snippet.thumbnails.high.url
									: 'https://lenix.dev/favicon.svg'
							}
						/>
						<AvatarFallback>
							<SmileySadIcon className="size-2/3 text-destructive" />
						</AvatarFallback>
					</Avatar>
					{selectedVideo && (
						<div className="*:text-foreground *:tracking-wide text-[0.8vw] font-light">
							<p className="font-bold">{he.decode(selectedVideo.snippet.title)}</p>
							<p>{he.decode(selectedVideo.snippet.channelTitle)}</p>
						</div>
					)}
				</div>
				{selectedVideo && <Progress value={10} />}
			</div>
			<div className="flex-1 flex justify-end">
				<Tooltip>
					<TooltipTrigger className="flex items-center" asChild>
						<Button
							size="icon-sm"
							variant="ghost"
							className="*:size-full"
							onClick={() =>
								setVolume((prev) => (prev ? { ...prev, isMuted: !volume.isMuted } : prev))
							}
						>
							{volume.isMuted ? (
								<SpeakerSimpleSlashIcon />
							) : volume.value === 0 ? (
								<SpeakerSimpleNoneIcon />
							) : volume.value < 50 ? (
								<SpeakerSimpleLowIcon />
							) : (
								<SpeakerSimpleHighIcon />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<Slider
							orientation="vertical"
							defaultValue={[volume.value]}
							onValueChange={(value) =>
								setVolume((prev) => (prev ? { ...prev, value: value[0] } : prev))
							}
							max={100}
							step={1}
							className="invert **:data-[slot=slider-track]:bg-foreground/20"
						/>
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
		<YouTube
			videoId={selectedVideo?.id.videoId}
			onReady={(e) => setPlayer(e.target)}
			onPlay={() => setPlaying(true)}
			onPause={() => setPlaying(false)}
			onEnd={() => setPlaying(false)}
			iframeClassName="absolute -top-full min-w-50 min-h-50 pointer-events-none"
		/>
	</>
}

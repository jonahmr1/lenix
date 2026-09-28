'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import YouTube, { type YouTubePlayer } from 'react-youtube'
import type {
	YoutubeVideoSearch,
} from 'youtube.ts/dist/types/SearchTypes'
import { Button } from '@/components/ui/button'
import {
	PauseIcon,
	PlayIcon,
	SmileySadIcon,
} from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import he from 'he'
import { Progress } from '@/components/ui/progress'
import { Volume } from '@/components/tone/volume'
import { Search } from '@/components/tone/search'


export default function Page() {
	const [selectedVideo, setSelected] = useState<
		YoutubeVideoSearch['items'][number] | null
	>(null)
	const [player, setPlayer] = useState<YouTubePlayer | null>(null)
	const [isPlaying, setPlaying] = useState(false)

	return (
		<div className="h-screen w-full">
			<div className="size-full flex flex-col justify-between px-[5vw] py-[5vh]">
				<div className="flex flex-col portrait:items-center">
					<div className="flex portrait:flex-wrap items-center justify-between *:mt-0 gap-[3vw]">
						<h1>Tonelix</h1>
						<div className='portrait:order-1 w-1/2 portrait:w-full flex justify-center'>
							<Search {...{ setPlayer, setSelected}} />
						</div>
						<Button onClick={() => toast.warning('Unavailable')}>
							Continue with Goggle
						</Button>
					</div>
					{/* input will be here in portrait mode */}
				</div>
			</div>
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
					<Volume player={selectedVideo ? player : null} />
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
		</div>
	)
}

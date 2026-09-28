'use client'

import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { Spinner } from '@/components/ui/spinner'
import { asserts } from '@lenix/lenix'
import { useState } from 'react'
import { toast } from 'sonner'
import YouTube, { type YouTubePlayer } from 'react-youtube'
import YoutubeAPI from 'youtube.ts/dist/API'
import type { YoutubeSearchParams, YoutubeVideoSearch } from 'youtube.ts/dist/types/SearchTypes'
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon, PauseIcon, PlayIcon, SmileySadIcon } from '@phosphor-icons/react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import he from 'he'
import { Progress } from '@/components/ui/progress'
import { Volume } from '@/components/tone/volume'

/* TODO: conceal */
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
asserts(apiKey, 'YOUTUBE_API_KEY missing')

const youtube = new YoutubeAPI(apiKey)

export default function Page() {
	const [searchInput, setInput] = useState('')
	const [videosFound, setVideos] = useState<YoutubeVideoSearch['items']>([])
	const [cmdOpen, setOpen] = useState(false)
	const [selectedVideo, setSelected] = useState<YoutubeVideoSearch['items'][number] | null>(null)
	const [searchLoading, setLoading] = useState(false)
	const [player, setPlayer] = useState<YouTubePlayer | null>(null)
	const [isPlaying, setPlaying] = useState(false)

	const search = async () => {
		setVideos([])
		setLoading(true)
		setSelected(null)
		try {
			const { items }: YoutubeVideoSearch = await youtube.get('search', {
				q: searchInput,
				type: 'video',
				videoEmbeddable: 'true',
			} satisfies YoutubeSearchParams)
			setVideos(items)
		} catch (e) {
			toast.error('Error')
			throw e
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="h-screen w-full">
			<div className="size-full flex flex-col justify-between px-[5vw] py-[5vh]">
				<div className="flex flex-col portrait:items-center">
					<div className="flex portrait:flex-wrap items-center justify-between *:mt-0 gap-[3vw]">
						<h1>Tonelix</h1>
						<InputGroup className="max-w-1/3 portrait:max-w-none portrait:order-1">
							<InputGroupInput placeholder="Type what do you wanna play" onClick={() => setOpen(true)} />
							<InputGroupAddon>
								<MagnifyingGlassIcon />
							</InputGroupAddon>
						</InputGroup>
						<Button onClick={() => toast.warning('Unavailable')}>Continue with Goggle</Button>
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
									selectedVideo ? selectedVideo.snippet.thumbnails.high.url : 'https://lenix.dev/favicon.svg'
								}
							/>
							<AvatarFallback>
								<SmileySadIcon className="size-2/3 text-destructive" />
							</AvatarFallback>
						</Avatar>
						{selectedVideo && (
							<div className="*:text-foreground *:tracking-wide">
								<p className="font-bold">{he.decode(selectedVideo.snippet.title)}</p>
								<p>{he.decode(selectedVideo.snippet.channelTitle)}</p>
							</div>
						)}
					</div>
					{selectedVideo && <Progress value={10} />}
				</div>
				<div className="flex-1 flex justify-end">
					<Volume setVolume={selectedVideo ? player?.setVolume : undefined} />
				</div>
			</div>
			<CommandDialog open={cmdOpen} onOpenChange={setOpen}>
				<Command className="border" shouldFilter={false}>
					<CommandInput
						placeholder="Search..."
						value={searchInput}
						onValueChange={setInput}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault()
								e.stopPropagation()
								search()
							}
						}}
					/>
					<CommandList>
						<CommandEmpty className="flex justify-center">
							{searchLoading ? (
								<>
									Searching <Spinner />
								</>
							) : (
								'No results.'
							)}
						</CommandEmpty>
						{videosFound.length > 0 && (
							<CommandGroup heading="Results found">
								{videosFound.map((video) => (
									<CommandItem
										key={video.etag}
										onSelect={() => {
											setPlayer(null)
											setSelected(video)
											setOpen(false)
										}}
									>
										{he.decode(video.snippet.title)}
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</CommandDialog>
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

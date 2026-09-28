"use client"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { asserts } from "@lenix/lenix"
import { useState } from "react"
import { toast } from "sonner"
import YouTube, { type YouTubePlayer } from "react-youtube"
import YoutubeAPI from "youtube.ts/dist/API"
import type {
  YoutubeSearchParams,
  YoutubeVideoSearch,
} from "youtube.ts/dist/types/SearchTypes"
import { Button } from "@/components/ui/button"
import { PauseIcon, PlayIcon } from "@phosphor-icons/react"

const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
asserts(apiKey, "YOUTUBE_API_KEY missing")

const youtube = new YoutubeAPI(apiKey)

export default function Page() {
  const [searchInput, setInput] = useState("")
  const [videosFound, setVideos] = useState<YoutubeVideoSearch["items"]>([])
  const [cmdOpen, setOpen] = useState(false)
  const [selectedVideo, setSelected] = useState("")
  const [searchLoading, setLoading] = useState(false)
  const [player, setPlayer] = useState<YouTubePlayer | null>(null)
  const [isPlaying, setPlaying] = useState(false)

  const search = async () => {
    setVideos([])
    setLoading(true)
    setSelected("")
    try {
      const { items }: YoutubeVideoSearch = await youtube.get("search", {
        q: searchInput,
        type: "video",
        videoEmbeddable: "true",
      } satisfies YoutubeSearchParams)
      setVideos(items)
    } catch (e) {
      toast.error("Error")
      throw e
    } finally {
      setLoading(false)
    }
  }

  return (
		<div className="h-screen w-full">
			<div className="h-full flex flex-col justify-between px-[5vw] py-[5vh]">
				<div className="flex items-center justify-between portrait:flex-col *:mt-0">
					<h1>Tonelix</h1>
					<Input
						className="max-w-2/3"
						placeholder="Search..."
						onClick={() => setOpen(true)}
					/>
					<Button>Continue with Goggle</Button>
				</div>
				<div>
					<Button
						className="w-full"
						disabled={!player}
						onClick={() =>
							isPlaying ? player?.pauseVideo() : player?.playVideo()
						}
					>
						{isPlaying ? <PauseIcon /> : <PlayIcon />}
					</Button>
				</div>
			</div>
			<CommandDialog open={cmdOpen} onOpenChange={setOpen}>
				<Command className="border" shouldFilter={false}>
					<CommandInput
						placeholder="Search..."
						value={searchInput}
						onValueChange={setInput}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault()
								e.stopPropagation()
								search()
							}
						}}
					/>
					<CommandList>
						<CommandEmpty className="flex justify-center">
							{searchLoading ? <>
								Searching <Spinner />
							</> : "No results found."}
						</CommandEmpty>
						{videosFound.length > 0 && (
							<CommandGroup heading="Results found">
								{videosFound.map((video) => (
									<CommandItem
										key={video.etag}
										onSelect={() => {
											setPlayer(null)
											setSelected(video.id.videoId)
											setOpen(false)
										}}
									>
										{video.snippet.title}
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</CommandDialog>
			<YouTube
				videoId={selectedVideo}
				onReady={(e) => setPlayer(e.target)}
				onPlay={() => setPlaying(true)}
				onPause={() => setPlaying(false)}
				onEnd={() => setPlaying(false)}
				iframeClassName="absolute -top-full min-w-50 min-h-50"
			/>
		</div>
  )
}

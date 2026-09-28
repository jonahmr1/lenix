'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import YouTube, { type YouTubePlayer } from 'react-youtube'
import type { YoutubeVideoSearch } from 'youtube.ts/dist/types/SearchTypes'
import { Button } from '@/components/ui/button'
import { Player } from '@/components/tone/player'
import { Search } from '@/components/tone/search'

export default function Page() {
	const [selectedVideo, setSelected] = useState<
		YoutubeVideoSearch['items'][number] | null
	>(null)
	const [player, setPlayer] = useState<YouTubePlayer | null>(null)

	return (
		<div className="h-screen w-full">
			<div className="size-full flex flex-col justify-between px-[5vw] py-[5vh]">
				<div className="flex flex-col portrait:items-center">
					<div className="flex portrait:flex-wrap items-center justify-between *:mt-0 gap-[3vw]">
						<h1>Tonelix</h1>
						<div className="portrait:order-1 w-1/2 portrait:w-full flex justify-center">
							<Search {...{ setPlayer, setSelected }} />
						</div>
						<Button onClick={() => toast.warning('Unavailable')}>
							Continue with Goggle
						</Button>
					</div>
					{/* input will be here in portrait mode */}
				</div>
			</div>
			<Player {...{ player, selectedVideo, setPlayer }} />
		</div>
	)
}

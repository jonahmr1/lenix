'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { YoutubeVideoSearch } from 'youtube.ts/dist/types/SearchTypes'
import { Button } from '@/components/ui/button'
import { Player } from '@/components/tone/player'
import { Search } from '@/components/tone/search'
import { createClient } from '@/lib/supabase.client'
import { User } from '@supabase/supabase-js'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePlayer } from '@/hooks/usePlayer'
import { YouTubePlayer } from 'react-youtube'
import YoutubeAPI from 'youtube.ts/dist/API'
import { asserts } from '@lenix/lenix'
import { YoutubeVideo } from 'youtube.ts/dist/types'

/* TODO: conceal */
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
asserts(apiKey, 'YOUTUBE_API_KEY missing')

const youtube = new YoutubeAPI(apiKey)

export default function Page() {
	const [selectedVideo, setSelected] = useState<
		YoutubeVideoSearch['items'][number] | null
	>(null)
	const [user, setUser] = useState<User | null>()
	const [ytPlayer, setYtPlayer] = useState<YouTubePlayer | null>(null)
	const player = usePlayer(ytPlayer, selectedVideo?.id.videoId)

	/* Load user and the last music */
	useEffect(() => {
		const timeout = setTimeout(async () => {
			const {
				data: { session },
				error,
			} = await createClient().auth.getSession()
			if (error || !session) {
				toast.error('Error', {
					description: JSON.stringify(error),
				})
				return
			}
			setUser(session.user)

			const { data } = await createClient()
				.from('player')
				.select('video_id, time, playing')
				.eq('id', session.user.id)
				.maybeSingle()

			if (data) {
				try {
					const { items }: { items: YoutubeVideo[] } = await youtube.get('video', {
						id: data.video_id,
						part: 'snippet',
					})

					const video = items[0]
					if (!video) {
						toast.error('Music unavailable')
						return
					}

					setSelected({
						kind: 'youtube#searchResult',
						etag: video.etag,
						id: { kind: 'youtube#video', videoId: video.id },
						snippet: video.snippet,
					})
				} catch {
					toast.error('Could not load the music')
				}
			}
		})

		return () => clearTimeout(timeout)
	}, [])

	useEffect(() => {
		if (!player || !selectedVideo) return

		createClient()
			.from('player')
			.upsert({
				video_id: selectedVideo.id.videoId,
				playing: player.isPlaying,
				time: Math.floor(player.currentTime)
			})
			.then(({ error }) => {
				if (error) toast.error('Error', {
					description: JSON.stringify(error)
				})
			})
	}, [player?.currentTime, selectedVideo?.id.videoId])

	return (
		<div className="h-screen w-full">
			<div className="size-full flex flex-col justify-between px-[5vw] py-[5vh]">
				<div className="flex flex-col portrait:items-center">
					<div className="flex portrait:flex-wrap items-center justify-between *:mt-0 gap-[3vw] *:flex-1">
						<h1>Tonelix</h1>
						<div className="portrait:order-1 w-1/2 portrait:w-full flex justify-center">
							<Search setSelected={setSelected} youtube={youtube} />
						</div>
						<div className="flex justify-end">
							{user === undefined ? (
								<Skeleton className="h-[5vh] w-[5vh] rounded-full" />
							) : user ? (
								<Avatar>
									<AvatarImage src={user.user_metadata.avatar_url} />
									<AvatarFallback>??</AvatarFallback>
								</Avatar>
							) : (
								<Button
									onClick={() => {
										createClient().auth.signInWithOAuth({
											provider: 'google',
											options: {
												redirectTo: `${window.location.origin}/auth/callback`,
											},
										})
									}}
								>
									Continue with Goggle
								</Button>
							)}
						</div>
					</div>
					{/* input will be here in portrait mode */}
				</div>
			</div>
			<Player
				selectedVideo={selectedVideo}
				player={player}
				setYtPlayer={setYtPlayer}
			/>
		</div>
	)
}

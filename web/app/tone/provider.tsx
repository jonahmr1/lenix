'use client'

import { asserts, storage, type S } from '@lenix/lenix'
import { User } from '@supabase/supabase-js'
import { createContext, useEffect, useState } from 'react'
import { YouTubePlayer } from 'react-youtube'
import { YoutubeVideoSearch } from 'youtube.ts/dist/types'
import YoutubeAPI from 'youtube.ts/dist/API'
import { YoutubeVideo } from 'youtube.ts/dist/types'
import { createClient } from '@/lib/supabase.client'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import Loading from '../loading'

/* TODO: conceal */
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
asserts(apiKey, 'YOUTUBE_API_KEY missing')

const youtube = new YoutubeAPI(apiKey)


interface States {
	video: YoutubeVideoSearch['items'][number] | null
	user: User | null
	ytPlayer: YouTubePlayer | null
	currentTime: number
	duration: number
	youtube: YoutubeAPI
	volume: number
	isMuted: boolean
	isPlaying: boolean
	autoplay: boolean
}

interface Setters {
	seek: (value: number) => Promise<void>
	setPlaying: (value: boolean) => Promise<void>
	setVolume: (value: number) => void
	togglePlay: () => Promise<void>
	toggleMute: () => Promise<void>
}

export const StatesContext = createContext<{
	states: States
	setStates: S<States>
} & Setters | null>(null)

export default function StatesProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [states, setStates] = useState<States>()

	useEffect(() => {
		const timeout = setTimeout(async () => {
			const storedVolume = storage.get<{ volume: number }, 'volume'>('volume')
			const storageIsMuted = storage.get<{ isMuted: boolean }, 'isMuted'>('isMuted')
			const { data: { session }, error } = await createClient().auth.getSession()
			if (error) {
				toast.error('Error', {
					description: JSON.stringify(error),
				})
				return
			}

			const re = session
				? await createClient()
					.from('player')
					.select('video_id, time, playing')
					.eq('id', session.user.id)
					.maybeSingle()
				: null

			const re$  = re?.data
				? await youtube.get('video', {
					id: re.data?.video_id,
					part: 'snippet',
				}) as { items: YoutubeVideo[] }
				: null

			const video = re$ ? re$.items[0] : null

			setStates({
				youtube,
				video: video ? {
					kind: 'youtube#searchResult',
					etag: video.etag,
					id: { kind: 'youtube#video', videoId: video.id },
					snippet: video.snippet,
				} : video,
				user: session ? session.user : null,
				ytPlayer: null,
				currentTime: re?.data?.time ?? 0,
				duration: 0,
				volume: storedVolume === null ? 20 : Number(storedVolume),
				isMuted: storageIsMuted === null ? false : storageIsMuted === 'true',
				isPlaying: false,
				autoplay: false,
			})
		})

		return () => clearTimeout(timeout)
	}, [])

	useEffect(() => {
		if (!states?.video || !states?.user) return

		createClient()
			.from('player')
			.upsert({
				video_id: states.video.id.videoId,
				playing: states.isPlaying,
				time: Math.floor(states.currentTime)
			})
			.then(({ error }) => {
				if (error) toast.error('Error', {
					description: JSON.stringify(error)
				})
			})
	}, [states?.currentTime, states?.video?.id.videoId])

	useEffect(() => {
		const ytPlayer = states?.ytPlayer
		if (!ytPlayer || !states.isPlaying) return

		const interval = setInterval(async () => {
      const currentTime = await ytPlayer.getCurrentTime()
      setStates(prev => prev ? ({ ...prev, currentTime }) : prev)
    }, 1000)

    return () => clearInterval(interval)
	}, [states?.ytPlayer, states?.isPlaying])

	if (!states) return <Loading />

	return (
		<StatesContext.Provider value={{
			states,
			setStates: setStates as S<States>,
			seek: async (time: number) => {
				setStates(prev => (prev ? { ...prev, currentTime: time } : prev))
				await states.ytPlayer?.seekTo(time, true)
			},
			togglePlay: async () => {
				if (!states.ytPlayer) return
				
				const status = await states.ytPlayer.getPlayerState()

				status === 1 ? states.ytPlayer.pauseVideo() : states.ytPlayer.playVideo()
			},
			setPlaying: async (isPlaying: boolean) => {
				setStates(prev => (prev ? { ...prev, isPlaying } : prev))
				if (isPlaying) {
					if (states.isMuted) await states.ytPlayer?.mute()
					else await states.ytPlayer?.unMute()
				}
			},
			toggleMute: async () => {
				const isUnMuted = !await states.ytPlayer?.isMuted()
				setStates((prev) => (prev ? { ...prev, isMuted: isUnMuted } : prev))
				storage.set<{ isMuted: boolean }, 'isMuted'>('isMuted', isUnMuted)
				if (isUnMuted) await states.ytPlayer?.mute()
				else await states.ytPlayer?.unMute()
			},
			setVolume: (volume: number) => {
				setStates(prev => (prev ? { ...prev, volume } : prev))
				states.ytPlayer?.setVolume(volume)
				storage.set<{ volume: number }, 'volume'>('volume', volume)
			},
		}}>
			{children}
		</StatesContext.Provider>
	)
}

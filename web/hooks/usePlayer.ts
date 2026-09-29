import { storage } from '@lenix/lenix'
import { useEffect, useState } from 'react'
import { YouTubePlayer } from 'react-youtube'

export const usePlayer = (
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
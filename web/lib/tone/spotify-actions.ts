'use server'

import { videoIdSchema } from './validation'

import { spotifySongKey } from './spotify-song-key'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/supabase/server'
import { searchTracks } from './search-actions'
import {
	fetchSpotifyPlaylistTracks,
	type SpotifyTrack,
} from './spotify-playlist'

type SkippedTrack = { title: string; artist: string; reason?: string }
export type SpotifyImportResult =
	| { error: string; skipped?: SkippedTrack[] }
	| {
		playlist: { id: string; name: string; tracks: string[] }
		skipped: SkippedTrack[]
	}

export async function readSpotifyPlaylist(
	link: string
): Promise<
	| { name: string; songs: SpotifyTrack[]; skipped: SkippedTrack[] }
	| { error: string }
> {
	let playlistId: string
	try {
		const url = new URL(link)
		const match = /^\/(?:intl-[a-z]+\/)?playlist\/([a-zA-Z0-9]{22})\/?$/.exec(
			url.pathname
		)
		if (
			url.protocol !== 'https:' ||
			url.hostname !== 'open.spotify.com' ||
			!match
		)
			throw new Error()
		playlistId = match[1]
	} catch {
		return { error: 'Enter a Spotify playlist link.' }
	}

	try {
		const store = await cookies()
		const supabase = createClient(store)
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()
		if (error || !user)
			return { error: 'Please sign in again to import a playlist.' }
		const responses = await Promise.all([
			fetch(`https://open.spotify.com/embed/playlist/${playlistId}`, {
				cache: 'no-store',
				signal: AbortSignal.timeout(15000),
			}),
			fetch(`https://open.spotify.com/playlist/${playlistId}`, {
				cache: 'no-store',
				signal: AbortSignal.timeout(15000),
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
				},
			}),
		])
		if (responses.some(response => !response.ok))
			return {
				error:
					'Couldn’t read this Spotify playlist. Make sure it is public and try again.',
			}
		const [embed, page] = await Promise.all(
			responses.map(response => response.text())
		)
		const embeddedData =
			/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/.exec(embed)?.[1]
		if (!embeddedData)
			return {
				error:
					'Spotify did not provide this playlist’s tracks. Please try again later.',
			}
		const state = JSON.parse(embeddedData)?.props?.pageProps?.state
		const entity = state?.data?.entity as
			| {
				name?: string
				trackList?: {
					title: string
					subtitle: string
					duration: number
					entityType: string
				}[]
			}
			| undefined
		const structuredData =
			/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/.exec(
				page
			)?.[1]
		const description = structuredData
			? JSON.parse(structuredData)?.description
			: undefined
		const total =
			typeof description === 'string'
				? /([\d,]+) items?/.exec(description)?.[1]
				: undefined
		if (!entity?.name || !Array.isArray(entity.trackList))
			return {
				error:
					'Spotify didn’t expose the complete playlist. No playlist was created.',
			}
		const count = total ? Number(total.replaceAll(',', '')) : undefined
		const tracks =
			count === entity.trackList.length
				? entity.trackList
				: await fetchSpotifyPlaylistTracks(
					playlistId,
					page,
					state?.settings?.session?.accessToken,
					count
				)
		const songs = tracks.filter(
			track => track.entityType === 'track' && track.title && track.subtitle
		)
		const skipped = tracks
			.filter(track => !songs.includes(track))
			.map(track => ({
				title: track.title || 'Unavailable track',
				artist: track.subtitle || 'Unknown artist',
			}))

		const { error: progressError } = await supabase
			.from('spotify_imports')
			.upsert({
				user_id: user.id,
				playlist_url: `https://open.spotify.com/playlist/${playlistId}`,
			})
		if (progressError)
			return {
				error:
					'Couldn’t save import progress to your account. Please try again.',
			}
		return { name: entity.name, songs, skipped }
	} catch {
		return { error: 'Couldn’t read your Spotify playlist. Please try again.' }
	}
}

export async function getSavedSpotifyMatches(): Promise<
	{ matches: Record<string, string | null> } | { error: string }
> {
	try {
		const supabase = createClient(await cookies())
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()
		if (error || !user)
			return { error: 'Please sign in again to resume your import.' }
		const matches: Record<string, string | null> = {}
		for (let offset = 0; ; offset += 1000) {
			const { data, error: readError } = await supabase
				.from('spotify_matches')
				.select('song_key, video_id')
				.eq('user_id', user.id)
				.order('song_key')
				.range(offset, offset + 999)
			if (readError) throw readError
			for (const row of data) matches[row.song_key] = row.video_id
			if (data.length < 1000) break
		}
		return { matches }
	} catch {
		return {
			error: 'Couldn’t load saved matches from your account. Please try again.',
		}
	}
}

export async function matchSpotifyTracks(
	songs: SpotifyTrack[]
): Promise<
	| { tracks: string[]; skipped: SkippedTrack[] }
	| { error: string; skipped?: SkippedTrack[] }
> {
	if (
		!Array.isArray(songs) ||
		songs.some(
			song =>
				!song ||
				typeof song.title !== 'string' ||
				typeof song.subtitle !== 'string' ||
				!Number.isFinite(song.duration)
		)
	)
		return { error: 'Invalid Spotify tracks. Please try again.' }
	try {
		const supabase = createClient(await cookies())
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser()
		if (authError || !user)
			return { error: 'Please sign in again to import tracks.' }
		const skipped: SkippedTrack[] = []
		const tracks: string[] = []
		for (const song of songs) {
			const key = spotifySongKey(song)
			const { data: cached, error: cacheError } = await supabase
				.from('spotify_matches')
				.select('video_id')
				.eq('user_id', user.id)
				.eq('song_key', key)
				.maybeSingle()
			if (cacheError)
				return { error: 'Couldn’t load saved matches. Please try again.' }
			if (cached) {
				if (cached.video_id && !tracks.includes(cached.video_id))
					tracks.push(cached.video_id)
				else
					skipped.push({
						title: song.title,
						artist: song.subtitle,
						...(cached.video_id
							? { reason: 'Matched a YouTube track already added' }
							: {}),
					})
				continue
			}
			const result = await searchTracks(
				`${song.title} ${song.subtitle}`
			)
			if ('error' in result) return { error: result.error }
			const normalize = (value: string) =>
				value
					.normalize('NFKD')
					.replace(/\p{M}/gu, '')
					.toLowerCase()
					.replace(/[^\p{L}\p{N}]+/gu, ' ')
					.trim()
			const titleWords = normalize(song.title).split(' ')
			const artist = normalize(song.subtitle)
			const ranked = result.tracks
				.map(track => {
					const title = normalize(track.title)
					const artistMatch = normalize(
						`${track.title} ${track.channel}`
					).includes(artist)
					const titleMatch =
						titleWords.filter(word => title.includes(word)).length /
						titleWords.length
					const seconds = track.duration
						.split(':')
						.reduce((total, part) => total * 60 + Number(part), 0)
					const difference = Math.abs(seconds - song.duration / 1000)
					const otherVersion = [
						'live',
						'remix',
						'cover',
						'karaoke',
						'slowed',
						'sped up',
					].some(
						version =>
							title.includes(version) &&
							!normalize(song.title).includes(version)
					)
					return {
						id: track.id,
						score:
							titleMatch * 5 +
							Number(artistMatch) * 3 +
							(difference < 10 ? 2 : difference < 30 ? 1 : 0) -
							Number(otherVersion) * 4,
						eligible: titleMatch >= 0.7 && artistMatch,
					}
				})
				.filter(track => track.eligible)
				.sort((a, b) => b.score - a.score)
			const { error: saveError } = await supabase
				.from('spotify_matches')
				.upsert({
					user_id: user.id,
					song_key: key,
					video_id: ranked[0]?.id ?? null,
				})
			if (saveError)
				return {
					error: 'Couldn’t save the match to your account. Please try again.',
				}
			if (ranked[0] && tracks.includes(ranked[0].id))
				skipped.push({
					title: song.title,
					artist: song.subtitle,
					reason: 'Matched a YouTube track already added',
				})
			else if (ranked[0]) tracks.push(ranked[0].id)
			else skipped.push({ title: song.title, artist: song.subtitle })
		}
		return { tracks, skipped }
	} catch {
		return { error: 'Couldn’t match Spotify tracks. Please try again.' }
	}
}

export async function saveSpotifyPlaylist(
	name: string,
	tracks: string[]
): Promise<
	| { playlist: { id: string; name: string; tracks: string[] } }
	| { error: string }
> {
	if (
		typeof name !== 'string' ||
		!name.trim() ||
		!Array.isArray(tracks) ||
		!tracks.length ||
		tracks.some(id => !videoIdSchema.safeParse(id).success)
	)
		return { error: 'Invalid playlist. Please try importing again.' }
	try {
		const supabase = createClient(await cookies())
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()
		if (error || !user)
			return { error: 'Please sign in again to save your playlist.' }
		const uniqueTracks = [...new Set(tracks)]
		const { data: playlist, error: saveError } = await supabase
			.from('playlists')
			.insert({ label: name, tracks: uniqueTracks, user_id: user.id })
			.select('id')
			.single()
		if (saveError || !playlist)
			return {
				error: 'Couldn’t save your imported playlist. Please try again.',
			}
		revalidatePath('/tone', 'layout')
		return {
			playlist: { id: playlist.id, name, tracks: uniqueTracks },
		}
	} catch {
		return { error: 'Couldn’t import your Spotify playlist. Please try again.' }
	}
}

'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase.server'
import { searchTracks } from './search-actions'

type SpotifyTrack = {
  title: string
  subtitle: string
  duration: number
  entityType: string
}
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
    const entity = JSON.parse(embeddedData)?.props?.pageProps?.state?.data
      ?.entity as
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
    if (
      !entity?.name ||
      !Array.isArray(entity.trackList) ||
      !total ||
      Number(total.replaceAll(',', '')) !== entity.trackList.length
    )
      return {
        error:
          'Spotify didn’t expose the complete playlist. No playlist was created.',
      }
    const songs = entity.trackList.filter(
      track => track.entityType === 'track' && track.title && track.subtitle
    )
    const skipped = entity.trackList
      .filter(track => !songs.includes(track))
      .map(track => ({
        title: track.title || 'Unavailable track',
        artist: track.subtitle || 'Unknown artist',
      }))

    return { name: entity.name, songs, skipped }
  } catch {
    return { error: 'Couldn’t read your Spotify playlist. Please try again.' }
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
    const skipped: SkippedTrack[] = []
    const tracks: string[] = []
    for (const song of songs) {
      const result = await searchTracks(
        `${song.title} ${song.subtitle}`.slice(0, 200)
      )
      if ('error' in result)
        return { error: `${result.error} No playlist was created.` }
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
      if (ranked[0] && tracks.includes(ranked[0].id))
        skipped.push({
          title: song.title,
          artist: song.subtitle,
          reason: 'Matched a YouTube track already added',
        })
      else if (ranked[0]) tracks.push(ranked[0].id)
      else skipped.push({ title: song.title, artist: song.subtitle })
    }
    if (!tracks.length)
      return {
        error:
          'No YouTube tracks were found for this playlist. No playlist was created.',
        skipped,
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
    name.length > 200 ||
    !Array.isArray(tracks) ||
    !tracks.length ||
    tracks.some(id => typeof id !== 'string' || !/^[\w-]{11}$/.test(id))
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

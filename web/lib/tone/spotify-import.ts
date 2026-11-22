import { spotifySongKey } from './spotify-song-key'
import { getSavedSpotifyMatches, matchSpotifyTracks } from './spotify-actions'
import type { SpotifyTrack } from './spotify-playlist'

export async function resumeSpotifyMatches(
  songs: SpotifyTrack[],
  onProgress: (progress: {
    checked: number
    total: number
    matched: number
  }) => void
): Promise<
  | {
      tracks: string[]
      skipped: { title: string; artist: string; reason?: string }[]
    }
  | {
      error: string
      skipped: { title: string; artist: string; reason?: string }[]
    }
> {
  const tracks: string[] = []
  const skipped: { title: string; artist: string; reason?: string }[] = []
  const saved = await getSavedSpotifyMatches()
  if ('error' in saved) return { error: saved.error, skipped }
  onProgress({ checked: 0, total: songs.length, matched: 0 })
  for (const [index, song] of songs.entries()) {
    const key = spotifySongKey(song)
    let id = saved.matches[key]
    if (id === undefined) {
      const result = await matchSpotifyTracks([song])
      if ('error' in result)
        return {
          error: `${result.error} Saved progress is kept in your account; resume to continue.`,
          skipped,
        }
      id = result.tracks[0] ?? null
      saved.matches[key] = id
    }
    if (id && !tracks.includes(id)) tracks.push(id)
    else
      skipped.push({
        title: song.title,
        artist: song.subtitle,
        ...(id ? { reason: 'Matched a YouTube track already added' } : {}),
      })
    onProgress({
      checked: index + 1,
      total: songs.length,
      matched: tracks.length,
    })
  }
  if (!tracks.length)
    return {
      error:
        'No YouTube tracks were found for this playlist. No playlist was created.',
      skipped,
    }
  return { tracks, skipped }
}

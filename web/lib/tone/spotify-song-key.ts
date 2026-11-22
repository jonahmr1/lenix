import type { SpotifyTrack } from './spotify-playlist'

export function spotifySongKey(song: SpotifyTrack) {
  return JSON.stringify([
    song.title.trim().toLowerCase(),
    song.subtitle.trim().toLowerCase(),
    song.duration,
  ])
}

export type SpotifyTrack = {
  title: string
  subtitle: string
  duration: number
  entityType: string
}

// The embed stops at 100 entries; the web player can read the remaining pages.
export async function fetchSpotifyPlaylistTracks(
  playlistId: string,
  page: string,
  accessToken: string,
  total?: number
): Promise<SpotifyTrack[]> {
  const bundleUrl = page.match(
    /<script[^>]*src="(https:\/\/open\.spotifycdn\.com\/cdn\/build\/web-player\/web-player\.[a-zA-Z0-9]+\.js)"/
  )?.[1]
  if (!bundleUrl || !accessToken) throw new Error('Missing Spotify session')
  const bundle = await fetch(bundleUrl, {
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  })
  if (!bundle.ok) throw new Error('Could not read Spotify web player')
  const hash = (await bundle.text()).match(
    /"fetchPlaylistContents","query","([a-f0-9]{64})"/
  )?.[1]
  if (!hash) throw new Error('Missing Spotify playlist query')

  const tracks: SpotifyTrack[] = []
  do {
    const response = await fetch(
      'https://api-partner.spotify.com/pathfinder/v2/query',
      {
        method: 'POST',
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          operationName: 'fetchPlaylistContents',
          variables: {
            uri: `spotify:playlist:${playlistId}`,
            offset: tracks.length,
            limit: 100,
            enableWatchFeedEntrypoint: false,
            includeEpisodeContentRatingsV2: true,
          },
          extensions: { persistedQuery: { version: 1, sha256Hash: hash } },
        }),
      }
    )
    if (!response.ok) throw new Error('Could not read Spotify playlist page')
    const result = await response.json()
    const content = result.data?.playlistV2?.content
    total ??= content?.totalCount
    if (
      result.errors?.length ||
      !Number.isSafeInteger(total) ||
      total === undefined ||
      total < 0 ||
      content?.totalCount !== total ||
      !Array.isArray(content.items) ||
      (!content.items.length && tracks.length < total) ||
      tracks.length + content.items.length > total
    )
      throw new Error('Incomplete Spotify playlist')

    for (const item of content.items) {
      const track = item?.itemV2?.data
      tracks.push({
        title: typeof track?.name === 'string' ? track.name : '',
        subtitle: Array.isArray(track?.artists?.items)
          ? track.artists.items
              .map(
                (artist: { profile?: { name?: string } }) =>
                  artist?.profile?.name
              )
              .filter((name: unknown) => typeof name === 'string' && name)
              .join(', ')
          : '',
        duration: Number.isFinite(track?.trackDuration?.totalMilliseconds)
          ? track.trackDuration.totalMilliseconds
          : 0,
        entityType: track?.__typename === 'Track' ? 'track' : 'unavailable',
      })
    }
  } while (tracks.length < total)
  return tracks
}

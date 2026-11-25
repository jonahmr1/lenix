import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { createClient } from '@/supabase/server'
import { getTrackDetails } from '@/lib/tone/track-details'
import { PlaylistTracks } from '@/components/tone/playlist-tracks'

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ playlistId: string }>
}) {
  const { playlistId } = await params
  const supabase = createClient(await cookies())
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: playlist, error } = await supabase
    .from('playlists')
    .select('tracks')
    .eq('id', playlistId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (error)
    return (
      <PlaylistTracks
        tracks={[]}
        error='Couldn’t load this playlist. Please try again.'
      />
    )
  if (!playlist) notFound()
  try {
    const tracks = await getTrackDetails(playlist.tracks)
    return <PlaylistTracks tracks={tracks} />
  } catch {
    return (
      <PlaylistTracks
        tracks={[]}
        error='Couldn’t load playlist tracks. Please try again.'
      />
    )
  }
}

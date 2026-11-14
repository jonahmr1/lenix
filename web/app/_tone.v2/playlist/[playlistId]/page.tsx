import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase.server'
import { SpinnerIcon } from '@phosphor-icons/react/dist/ssr'
import { readPlaylist } from '../../playlist-data'
import { AuthControls } from '@/components/tone/auth-controls'
import { readTracks } from '../../youtube'
import { TrackTable } from '@/components/tone/track-table'
import { TrackError } from '@/components/tone/track-error'

async function PlaylistDetails({
  params,
}: {
  params: Promise<{ playlistId: string }>
}) {
  const { playlistId } = await params
  const supabase = createClient(await cookies())
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <AuthControls
          account={null}
          initialMessage="Please sign in again to open this playlist."
        />
      </div>
    )
  }

  const playlist = await readPlaylist(supabase, user.id, playlistId)
  if (!playlist) notFound()

  return (
    <section className="w-full space-y-4 px-5 py-10">
      <div className='px-10'>
				<h1 className="max-w-full text-8xl font-black tracking-tight wrap-break-words">
					{playlist.label}
				</h1>
				<p className="text-sm text-muted-foreground">
					{playlist.trackCount} {playlist.trackCount === 1 ? 'track' : 'tracks'}
				</p>
			</div>
      {playlist.tracks.length ? (
        <Suspense
          fallback={
            <SpinnerIcon
              role="status"
              aria-label="Loading tracks"
              className="size-5 animate-spin"
            />
          }
        >
          <PlaylistTracks ids={playlist.tracks} />
        </Suspense>
      ) : (
        <p className="text-sm text-muted-foreground">
          Search for a song on the Tonelix home page, then use + to add it here.
        </p>
      )}
    </section>
  )
}

async function PlaylistTracks({ ids }: { ids: string[] }) {
  let tracks
  try {
    tracks = await readTracks(ids)
  } catch (error) {
    return (
      <TrackError
        message={
          error instanceof Error
            ? error.message
            : 'Couldn’t load tracks. Please try again.'
        }
      />
    )
  }
  return <TrackTable tracks={tracks} />
}

export default function PlaylistPage({
  params,
}: {
  params: Promise<{ playlistId: string }>
}) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <SpinnerIcon
            role="status"
            aria-label="Loading playlist"
            className="size-4 animate-spin"
          />
        </div>
      }
    >
      <PlaylistDetails params={params} />
    </Suspense>
  )
}

import { Suspense } from 'react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { SpinnerIcon } from '@phosphor-icons/react/dist/ssr'
import { createClient } from '@/lib/supabase.server'
import { Button } from '@/components/ui/button'
import { AuthControls } from '@/components/tone/auth-controls'
import { readPlaylists } from '../playlist-data'
import { searchTracks } from '../youtube'
import { TrackTable } from '@/components/tone/track-table'
import { TrackError } from '@/components/tone/track-error'

type SearchParams = Promise<{ q?: string | string[]; page?: string | string[] }>

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q.trim() : ''
  const page = typeof params.page === 'string' ? params.page : ''
  const supabase = createClient(await cookies())
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user)
    return (
      <AuthControls
        account={null}
        initialMessage="Please sign in again to search."
      />
    )
  if (!q)
    return (
      <p className="py-8 text-sm text-muted-foreground">
        Search for a song or artist on the Tonelix home page.
      </p>
    )

  let result
  let playlists
  try {
    const [found, library] = await Promise.all([
      searchTracks(q, page),
      readPlaylists(supabase, user.id),
    ])
    if (library.error) throw new Error(library.error)
    result = found
    playlists = library.playlists
  } catch (error) {
    return (
      <div className="py-8">
        <TrackError
          message={
            error instanceof Error
              ? error.message
              : 'Couldn’t search YouTube. Please try again.'
          }
        />
      </div>
    )
  }
  return (
    <section className="w-full py-8">
      <h1 className="text-xl font-medium break-words">Results for “{q}”</h1>
      <p className="mt-1 mb-4 text-xs text-muted-foreground">From YouTube</p>
      {result.tracks.length ? (
        <TrackTable tracks={result.tracks} playlists={playlists} />
      ) : (
        <p className="text-sm text-muted-foreground">
          No tracks found. Try another song or artist.
        </p>
      )}
      <div className="mt-4 flex justify-between gap-3">
        {page && (
          <Button variant="outline" asChild>
            <Link
              prefetch={false}
              href={`/tone/search?${new URLSearchParams({ q })}`}
            >
              First results
            </Link>
          </Button>
        )}
        {result.nextPageToken && (
          <Button variant="outline" asChild className="ml-auto">
            <Link
              prefetch={false}
              href={`/tone/search?${new URLSearchParams({ q, page: result.nextPageToken })}`}
            >
              Next results
            </Link>
          </Button>
        )}
      </div>
    </section>
  )
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <Suspense
      fallback={
        <SpinnerIcon
          role="status"
          aria-label="Searching YouTube"
          className="mx-auto my-8 size-5 animate-spin"
        />
      }
    >
      <Results searchParams={searchParams} />
    </Suspense>
  )
}

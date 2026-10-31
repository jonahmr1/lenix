import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase.server'
import { SpinnerIcon } from '@phosphor-icons/react/dist/ssr'
import { readPlaylist } from '../../playlist-data'
import { AuthControls } from '../../auth-controls'

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
    <section className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="max-w-full text-2xl font-medium tracking-tight break-words">
        {playlist.label}
      </h1>
      <p className="text-sm text-muted-foreground">
        {playlist.trackCount} {playlist.trackCount === 1 ? 'track' : 'tracks'}
      </p>
    </section>
  )
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

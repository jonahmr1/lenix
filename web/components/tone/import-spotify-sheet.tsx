'use client'

import Link from './navigation-link'
import { resumeSpotifyMatches } from '@/lib/tone/spotify-import'
import {
  CheckCircleIcon,
  CircleIcon,
  WarningCircleIcon,
  SpinnerGapIcon,
} from '@phosphor-icons/react'
import { Marker, MarkerContent, MarkerIcon } from '@/components/ui/marker'
import { useApp } from '@/app/tone/provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  readSpotifyPlaylist,
  saveSpotifyPlaylist,
} from '@/lib/tone/spotify-actions'

export function ImportSpotifySheet() {
  const { state, setState } = useApp()
  const result = state.spotifyImportResult

  return (
    <Sheet
      open={state.spotifyImportOpen}
      onOpenChange={spotifyImportOpen => {
        if (!state.playlistSaving)
          setState(previous => ({ ...previous, spotifyImportOpen }))
      }}
    >
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle>Import from Spotify</SheetTitle>
          <SheetDescription>
            Paste a public Spotify playlist link to create a playlist with its
            songs on YouTube.
          </SheetDescription>
        </SheetHeader>
        <form
          noValidate
          id='spotify-import-form'
          className='flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6'
          onSubmit={async event => {
            event.preventDefault()
            if (state.playlistSaving || (result && 'playlist' in result)) return
            setState(previous => ({
              ...previous,
              playlistSaving: true,
              spotifyImportResult: null,
              spotifyImportStep: 1,
              spotifyImportProgress: null,
            }))
            try {
              const source = await readSpotifyPlaylist(
                state.spotifyPlaylistUrl.trim()
              )
              if ('error' in source) {
                setState(previous => ({
                  ...previous,
                  spotifyImportResult: source,
                }))
                return
              }
              setState(previous => ({ ...previous, spotifyImportStep: 2 }))
              const matches = await resumeSpotifyMatches(
                source.songs,
                spotifyImportProgress =>
                  setState(previous => ({ ...previous, spotifyImportProgress }))
              )
              if ('error' in matches) {
                setState(previous => ({
                  ...previous,
                  spotifyImportResult: matches,
                }))
                return
              }
              setState(previous => ({ ...previous, spotifyImportStep: 3 }))
              const saved = await saveSpotifyPlaylist(
                source.name,
                matches.tracks
              )
              setState(previous => ({
                ...previous,
                spotifyImportResult: {
                  ...saved,
                  skipped: [...source.skipped, ...matches.skipped],
                },
                ...('playlist' in saved
                  ? {
                      spotifyImportStep: 4,
                      playlists: [...previous.playlists, saved.playlist],
                    }
                  : {}),
              }))
            } catch {
              setState(previous => ({
                ...previous,
                spotifyImportResult: {
                  error:
                    'Couldn’t finish the import. Saved matches will be reused when you try again.',
                },
              }))
            } finally {
              setState(previous => ({ ...previous, playlistSaving: false }))
            }
          }}
        >
          <Field>
            <FieldLabel htmlFor='spotify-playlist-url'>
              Playlist link
            </FieldLabel>
            <Input
              id='spotify-playlist-url'
              name='url'
              type='url'
              placeholder='https://open.spotify.com/playlist/…'
              autoComplete='off'
              className='text-base'
              disabled={state.playlistSaving}
              value={state.spotifyPlaylistUrl}
              onChange={event =>
                setState(previous => ({
                  ...previous,
                  spotifyPlaylistUrl: event.target.value,
                  spotifyImportResult: null,
                  spotifyImportStep: 0,
                  spotifyImportProgress: null,
                }))
              }
            />
          </Field>
          <div
            className='grid gap-3'
            aria-live='polite'
            aria-label='Import steps'
          >
            {[
              'Read Spotify playlist',
              'Find tracks on YouTube',
              'Save playlist',
            ].map((label, index) => {
              const step = index + 1
              const complete = state.spotifyImportStep > step
              const active = state.spotifyImportStep === step
              const failed = active && result && 'error' in result
              return (
                <Marker
                  key={label}
                  className={failed ? 'text-destructive' : undefined}
                >
                  <MarkerIcon>
                    {complete ? (
                      <CheckCircleIcon />
                    ) : failed ? (
                      <WarningCircleIcon />
                    ) : active && state.playlistSaving ? (
                      <SpinnerGapIcon className='animate-spin' />
                    ) : (
                      <CircleIcon />
                    )}
                  </MarkerIcon>
                  <MarkerContent>
                    {label}
                    {complete
                      ? ' · Done'
                      : failed
                        ? step === 2
                          ? ' · Paused'
                          : ' · Failed'
                        : active && state.playlistSaving
                          ? '…'
                          : ''}
                    {step === 2 && state.spotifyImportProgress && (
                      <span className='block'>
                        {state.spotifyImportProgress.checked} of{' '}
                        {state.spotifyImportProgress.total} checked ·{' '}
                        {state.spotifyImportProgress.matched} matched
                      </span>
                    )}
                  </MarkerContent>
                </Marker>
              )
            })}
          </div>
          {result && (
            <Marker
              role={'error' in result ? 'alert' : 'status'}
              className={'error' in result ? 'text-destructive' : undefined}
            >
              <MarkerIcon>
                {'error' in result ? (
                  <WarningCircleIcon />
                ) : (
                  <CheckCircleIcon />
                )}
              </MarkerIcon>
              <MarkerContent>
                {'error' in result
                  ? result.error
                  : `Imported “${result.playlist.name}” · ${result.playlist.tracks.length} tracks added.`}
              </MarkerContent>
            </Marker>
          )}
          {!!result?.skipped?.length && (
            <section className='grid gap-3' aria-label='Tracks not imported'>
              <Marker variant='border'>
                <MarkerIcon>
                  <WarningCircleIcon />
                </MarkerIcon>
                <MarkerContent>
                  {result.skipped.length}{' '}
                  {result.skipped.length === 1 ? 'track' : 'tracks'} not
                  imported
                </MarkerContent>
              </Marker>
              <ul className='grid gap-3'>
                {result.skipped.map((track, index) => (
                  <li key={index}>
                    <Marker>
                      <MarkerContent>
                        {track.title} — {track.artist}
                        {track.reason && ` · ${track.reason}`}
                      </MarkerContent>
                    </Marker>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </form>
        <SheetFooter>
          {result && 'playlist' in result ? (
            <Button asChild className='w-full'>
              <Link
                href={`/tone/playlist/${result.playlist.id}`}
                onClick={() =>
                  setState(previous => ({
                    ...previous,
                    spotifyImportOpen: false,
                  }))
                }
              >
                Open playlist
              </Link>
            </Button>
          ) : (
            <Button
              form='spotify-import-form'
              type='submit'
              className='w-full'
              disabled={state.playlistSaving}
            >
              {state.playlistSaving
                ? 'Importing…'
                : state.spotifyImportStep === 2 && result && 'error' in result
                  ? 'Resume import'
                  : 'Import playlist'}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

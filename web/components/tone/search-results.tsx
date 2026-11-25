'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useApp } from '@/app/tone/provider'
import { Spinner } from '@/components/ui/spinner'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { searchTracks } from '@/lib/tone/search-actions'
import { SearchTrackMenu } from './search-track-menu'

export function SearchResults() {
  const { state, setState } = useApp()
  const loadMoreTarget = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const target = loadMoreTarget.current
    const token = state.searchNextPageToken
    const query = state.searchActiveQuery
    if (!target || !token || state.searchLoading || state.searchMoreLoading)
      return
    let requested = false
    const observer = new IntersectionObserver(
      async entries => {
        if (requested || !entries.some(entry => entry.isIntersecting)) return
        requested = true
        observer.disconnect()
        setState(previous => ({ ...previous, searchMoreLoading: true }))
        try {
          const result = await searchTracks(query, token)
          if ('error' in result) throw new Error(result.error)
          setState(previous => {
            if (
              previous.searchActiveQuery !== query ||
              previous.searchNextPageToken !== token
            )
              return previous
            const tracks = new Map(
              (previous.searchResults ?? []).map(track => [track.id, track])
            )
            result.tracks.forEach(track => tracks.set(track.id, track))
            return {
              ...previous,
              searchResults: [...tracks.values()],
              searchNextPageToken:
                result.nextPageToken === token ? null : result.nextPageToken,
            }
          })
        } catch (error) {
          setState(previous => ({ ...previous, searchNextPageToken: null }))
          toast.error(
            error instanceof Error
              ? error.message
              : 'Couldn’t load more tracks. Please try again.',
            {
              action: {
                label: 'Retry',
                onClick: () =>
                  setState(previous =>
                    previous.searchActiveQuery === query
                      ? { ...previous, searchNextPageToken: token }
                      : previous
                  ),
              },
            }
          )
        } finally {
          setState(previous => ({ ...previous, searchMoreLoading: false }))
        }
      },
      { rootMargin: '300px' }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [
    state.searchNextPageToken,
    state.searchActiveQuery,
    state.searchLoading,
    state.searchMoreLoading,
    setState,
  ])
  return (
    <>
      {state.searchResults !== null && !state.searchLoading && (
        <h1 className='text-2xl font-semibold break-words md:text-3xl'>
          Results for “{state.searchActiveQuery}”
        </h1>
      )}
      {state.searchLoading ? (
        <div
          role='status'
          className='flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground'
        >
          <Spinner />
          Searching YouTube…
        </div>
      ) : state.searchResults?.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className='hidden sm:table-cell'>Author</TableHead>
              <TableHead className='text-right'>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.searchResults.map((track, index) => (
              <SearchTrackMenu key={track.id} track={track}>
                <TableRow
                  className='cursor-pointer border-0'
                  tabIndex={0}
                  aria-label={`Play ${track.title}`}
                  data-state={
                    state.currentTrack?.id === track.id ? 'selected' : undefined
                  }
                  onClick={() => {
                    state.player?.loadVideoById(track.id)
                    setState(previous => ({
                      ...previous,
                      currentTrack: track,
                    }))
                  }}
                  onKeyDown={event => {
                    if (event.target !== event.currentTarget) return
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      state.player?.loadVideoById(track.id)
                      setState(previous => ({
                        ...previous,
                        currentTrack: track,
                      }))
                    }
                  }}
                >
                  <TableCell className='text-muted-foreground tabular-nums'>
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <img
                        src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`}
                        alt=''
                        width={32}
                        height={32}
                        className='size-8 shrink-0 rounded-md object-cover'
                      />
                      <div className='min-w-0'>
                        <p className='font-medium whitespace-normal'>
                          {track.title}
                        </p>
                        <p className='mt-1 whitespace-normal text-muted-foreground sm:hidden'>
                          {track.channel}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='hidden whitespace-normal text-muted-foreground sm:table-cell'>
                    {track.channel}
                  </TableCell>
                  <TableCell className='text-right text-muted-foreground tabular-nums'>
                    {track.duration}
                  </TableCell>
                </TableRow>
              </SearchTrackMenu>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>
              {/* Show history */}
              {state.searchResults ? 'No results found' : 'Find your music'}
            </EmptyTitle>
            <EmptyDescription>
              {state.searchResults
                ? 'Try another song or artist.'
                : 'Search YouTube for a song or artist to get started.'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {state.searchNextPageToken && !state.searchLoading && (
        <div
          ref={loadMoreTarget}
          className='flex min-h-10 justify-center'
          role='status'
          aria-label={
            state.searchMoreLoading ? 'Loading more tracks' : undefined
          }
        >
          {state.searchMoreLoading && <Spinner />}
        </div>
      )}
    </>
  )
}

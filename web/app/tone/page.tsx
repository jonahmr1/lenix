'use client'

import { toast } from 'sonner'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
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
import { useApp } from './provider'
import { Kbd, KbdGroup } from '@/components/ui/kbd'

export default function TonePage() {
  const { state, setState } = useApp()
  return (
    <div className='not-typeset flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6'>
      <form
        role='search'
        onSubmit={async event => {
          event.preventDefault()
          if (state.searchLoading) return
          const query = state.searchQuery.trim()
          if (!query) {
            toast.error('Enter a song or artist.')
            return
          }
          setState(previous => ({ ...previous, searchLoading: true }))
          try {
            const result = await searchTracks(query)
            if ('error' in result) {
              toast.error(result.error)
              return
            }
            setState(previous => ({
              ...previous,
              searchResults: result.tracks,
            }))
          } catch {
            toast.error('Couldn’t search YouTube. Please try again.')
          } finally {
            setState(previous => ({ ...previous, searchLoading: false }))
          }
        }}
      >
        <InputGroup>
          <InputGroupInput
            aria-label='Search YouTube'
            placeholder='Search songs or artists on YouTube'
            value={state.searchQuery}
            disabled={state.searchLoading}
            onChange={event =>
              setState(previous => ({
                ...previous,
                searchQuery: event.target.value,
              }))
            }
          />
          <InputGroupAddon>
            <MagnifyingGlassIcon />
          </InputGroupAddon>
          <InputGroupAddon align='inline-end' className='gap-2'>
            <KbdGroup>
							<Kbd>Ctrl</Kbd>
							<Kbd>K</Kbd>
						</KbdGroup>
						<InputGroupButton
              type='submit'
              disabled={state.searchLoading}
              aria-label='Search'
							variant='secondary'
							className='rounded-sm border-0'
            >
              {state.searchLoading ? <Spinner /> : 'Search'}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
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
              <TableHead>Track</TableHead>
              <TableHead className='hidden sm:table-cell'>Channel</TableHead>
              <TableHead className='text-right'>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.searchResults.map(track => (
              <TableRow key={track.id}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <img
                      src={`https://i.ytimg.com/vi/${track.id}/mqdefault.jpg`}
                      alt=''
                      width={80}
                      height={45}
                      className='aspect-video w-20 shrink-0 rounded-md object-cover'
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
            ))}
          </TableBody>
        </Table>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>
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
    </div>
  )
}

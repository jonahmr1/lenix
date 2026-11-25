import { Fragment, type ReactElement, type ReactNode } from 'react'
import { useApp } from '@/app/tone/provider'
import type { SearchTrack } from '@/lib/tone/search-actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function TrackTable({ tracks, tiers, renderMenu }: {
  tracks: SearchTrack[]
  tiers?: Record<string, number>
  renderMenu: (track: SearchTrack, row: ReactElement) => ReactNode
}) {
  const {state, setState} = useApp()
  return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>#</TableHead>
              <TableHead>Track</TableHead>
              <TableHead className='text-right'>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks.map((track, index) => {
              const play = () => {
                state.player?.loadVideoById(track.id)
                setState(previous => ({ ...previous, currentTrack: track }))
              }
              return (
                <Fragment key={track.id}>
                  {tiers && (index === 0 || tiers[tracks[index - 1].id] !== tiers[track.id]) && (
                    <TableRow className='bg-muted/50 hover:bg-muted/50'>
                      <TableHead colSpan={3}>Tier {tiers[track.id]}</TableHead>
                    </TableRow>
                  )}
                  {renderMenu(track,
                <TableRow
                  className='cursor-pointer border-0'
                  tabIndex={0}
                  aria-label={`Play ${track.title}`}
                  data-state={
                    state.currentTrack?.id === track.id ? 'selected' : undefined
                  }
                  onClick={play}
                  onKeyDown={event => {
                    if (event.target !== event.currentTarget) return
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      play()
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
                        <p className='mt-1 whitespace-normal text-muted-foreground'>
                          {track.channel}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-right text-muted-foreground tabular-nums'>
                    {track.duration}
                  </TableCell>
                </TableRow>
                  )}
                </Fragment>
              )
            })}
          </TableBody>
        </Table>
  )
}

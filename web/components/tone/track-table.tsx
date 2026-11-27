'use client'

import { Fragment, type ReactElement, type ReactNode } from 'react'
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  createFilteredRowModel,
  filterFn_includesString,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
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

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { TrackMenu } from './track-menu'
import { CaretDownIcon } from '@phosphor-icons/react'

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
})
const columnHelper = createColumnHelper<typeof features, SearchTrack>()
const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onClick={event => event.stopPropagation()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableHiding: false,
  }),
  columnHelper.display({
    id: 'number',
    header: '#',
    cell: ({ row }) => (
      <span className='text-muted-foreground tabular-nums'>
        {row.index + 1}
      </span>
    ),
  }),
  columnHelper.accessor('title', {
    header: 'Track',
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <img
          src={`https://i.ytimg.com/vi/${row.original.id}/mqdefault.jpg`}
          alt=''
          width={32}
          height={32}
          className='size-8 shrink-0 rounded-md object-cover'
        />
        <div className='min-w-0'>
          <p className='font-medium whitespace-normal'>{row.original.title}</p>
          <p className='mt-1 whitespace-normal text-muted-foreground'>
            {row.original.channel}
          </p>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('duration', {
    header: () => <div className='text-right'>Duration</div>,
    cell: ({ getValue }) => (
      <div className='text-right text-muted-foreground tabular-nums'>
        {getValue()}
      </div>
    ),
  }),
])

export function TrackTable({
  tracks,
  tiers,
  renderMenu,
  playlistId,
}: {
  tracks: SearchTrack[]
  tiers?: Record<string, number>
  playlistId?: string
  renderMenu: (track: SearchTrack, row: ReactElement) => ReactNode
}) {
  const { state, setState } = useApp()
  const table = useTable({
    features,
    data: tracks,
    columns,
    getRowId: track => track.id,
    state: { columnVisibility: { select: !!tiers, number: !playlistId } },
  })
  const selectedTracks = table
    .getSelectedRowModel()
    .rows.map(row => row.original)
  const rows = table.getRowModel().rows
  const showTiers = tiers && new Set(Object.values(tiers)).size > 1

  return (
    <div className='w-full'>
      {tiers && (
        <div className='flex items-center py-4 gap-2'>
          <Input
            placeholder='Filter tracks...'
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={event =>
              table.getColumn('title')?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
          <TrackMenu tracks={selectedTracks} playlistId={playlistId} dropdown>
            <Button
              variant='outline'
              className='ml-auto'
              disabled={!selectedTracks.length}
            >
              Actions
              <CaretDownIcon />
            </Button>
          </TrackMenu>
        </div>
      )}
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(group => (
              <TableRow key={group.id}>
                {group.headers.map(header => (
                  <TableHead key={header.id} className={header.column.id === 'select' ? 'w-10' : undefined}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!rows.length && (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
            {rows.map((row, index) => {
              const track = row.original
              const play = () => {
                state.player?.loadVideoById(track.id)
                setState(previous => ({ ...previous, currentTrack: track }))
              }
              return (
                <Fragment key={row.id}>
                  {showTiers &&
                    (index === 0 ||
                      tiers[rows[index - 1].original.id] !==
                        tiers[track.id]) && (
                      <TableRow className='bg-muted/50 hover:bg-muted/50'>
                        <TableHead
                          colSpan={table.getVisibleLeafColumns().length}
                        >
                          Tier {tiers[track.id]}
                        </TableHead>
                      </TableRow>
                    )}
                  {renderMenu(
                    track,
                    <TableRow
                      tabIndex={0}
                      aria-label={`Play ${track.title}`}
                      data-state={row.getIsSelected() ? 'selected' : undefined}
                      onClick={play}
                      onKeyDown={event => {
                        if (event.target !== event.currentTarget) return
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          play()
                        }
                      }}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          <table.FlexRender cell={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  )}
                </Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>
      {tiers && (
        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='flex-1 text-sm text-muted-foreground'>
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        </div>
      )}
    </div>
  )
}

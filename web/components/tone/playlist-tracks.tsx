'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { toast } from 'sonner'
import type { SearchTrack } from '@/lib/tone/search-actions'
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from '@/components/ui/table'
import {
	Empty,
	EmptyHeader,
	EmptyTitle,
	EmptyDescription,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, DotIcon, PlayIcon } from '@phosphor-icons/react'
import { notFound, useParams } from 'next/navigation'
import { useApp } from '@/app/tone/provider'
import { Separator } from '../ui/separator'
import { setTrackInPlaylist } from '@/lib/tone/track-actions'
import {
	ContextMenu,
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
} from '../ui/context-menu'

export function PlaylistTracks({
	tracks,
	error,
}: {
	tracks: SearchTrack[]
	error?: string
}) {
	const { playlistId } = useParams<{ playlistId: string }>()
	const { state, setState } = useApp()
	const playlist = state.playlists.find(playlist => playlist.id === playlistId)

	useEffect(() => {
		if (error) toast.error(error)
	}, [error])
	if (!playlist) notFound()
	const visibleTracks = tracks.filter(track =>
		playlist.tracks.includes(track.id)
	)

	return (
		<div className='not-typeset flex flex-1 flex-col gap-6 p-4 md:p-6'>
			<Button asChild variant='ghost' size='icon' className='self-start'>
				<Link href='/tone' aria-label='Back to home'>
					<ArrowLeftIcon />
				</Link>
			</Button>
			<h1 className='text-8xl font-bold'>{playlist.name}</h1>
			<Separator />
			<div className='flex items-center'>
				<Button
					className='size-12 rounded-full'
					size='icon-lg'
					aria-label='Play playlist'
					disabled={!visibleTracks.length}
					onClick={() =>
						setState(previous => ({
							...previous,
							currentTrack: visibleTracks[0],
						}))
					}
				>
					<PlayIcon className='size-1/2' weight='fill' />
				</Button>
				<DotIcon className='text-5xl' />
				<p>{visibleTracks.length} Track</p>
			</div>
			{visibleTracks.length ? (
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
						{visibleTracks.map((track, index) => (
							<ContextMenu key={track.id}>
								<ContextMenuTrigger asChild>
									<TableRow
										className='cursor-pointer border-0'
										tabIndex={0}
										aria-label={`Play ${track.title}`}
										data-state={
											state.currentTrack?.id === track.id
												? 'selected'
												: undefined
										}
										onClick={() =>
											setState(previous => ({
												...previous,
												currentTrack: track,
											}))
										}
										onKeyDown={event => {
											if (event.target !== event.currentTarget) return
											if (event.key === 'Enter' || event.key === ' ') {
												event.preventDefault()
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
								</ContextMenuTrigger>
								<ContextMenuContent>
									<ContextMenuItem
										variant='destructive'
										onSelect={async () => {
											const saving = toast.loading('Removing track…')
											try {
												const result = await setTrackInPlaylist(
													playlist.id,
													track.id,
													false
												)
												if ('error' in result) throw new Error(result.error)
												setState(previous => ({
													...previous,
													playlists: previous.playlists.map(item =>
														item.id === playlist.id
															? {
																	...item,
																	tracks: item.tracks.filter(
																		id => id !== track.id
																	),
																}
															: item
													),
												}))
												toast.success(`Removed from ${result.playlistName}`, {
													id: saving,
												})
											} catch (error) {
												toast.error(
													error instanceof Error
														? error.message
														: 'Couldn’t remove this track. Please try again.',
													{ id: saving }
												)
											}
										}}
									>
										Remove from playlist
									</ContextMenuItem>
								</ContextMenuContent>
							</ContextMenu>
						))}
					</TableBody>
				</Table>
			) : (
				!error && (
					<Empty>
						<EmptyHeader>
							<EmptyTitle>No tracks yet</EmptyTitle>
							<EmptyDescription>
								Search for music and add tracks to this playlist.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				)
			)}
		</div>
	)
}

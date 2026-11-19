'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { MagnifyingGlassIcon, SparkleIcon } from '@phosphor-icons/react'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import {
	ContextMenu,
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuGroup,
	ContextMenuLabel,
	ContextMenuCheckboxItem,
} from '@/components/ui/context-menu'
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
import { setTrackInPlaylist } from '@/lib/tone/track-actions'
import { useApp } from './provider'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { useSidebar } from '@/components/ui/sidebar'

export default function TonePage() {
	const { state, setState } = useApp()
	const searchInput = useRef<HTMLInputElement>(null)
	const loadMoreTarget = useRef<HTMLDivElement>(null)
	const { isMobile } = useSidebar()

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.key.toLowerCase() !== 'k' ||
				!event.ctrlKey ||
				event.metaKey ||
				event.altKey ||
				event.shiftKey ||
				event.repeat
			)
				return
			if (
				event.target instanceof HTMLElement &&
				event.target.closest('[role="dialog"]')
			)
				return
			event.preventDefault()
			searchInput.current?.focus()
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])
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
		<div className='not-typeset flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6'>
			<form
				role='search'
				onSubmit={async event => {
					event.preventDefault()
					if (state.searchLoading || state.searchMoreLoading) return
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
							searchActiveQuery: query,
							searchNextPageToken: result.nextPageToken,
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
						ref={searchInput}
						aria-keyshortcuts='Control+k'
						aria-label='Search YouTube'
						placeholder='Search songs or artists on YouTube'
						value={state.searchQuery}
						disabled={state.searchLoading || state.searchMoreLoading}
						className='text-base'
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
						{!isMobile && (
							<KbdGroup>
								<Kbd>Ctrl</Kbd>
								<Kbd>K</Kbd>
							</KbdGroup>
						)}
						<InputGroupButton
							type='submit'
							disabled={state.searchLoading || state.searchMoreLoading}
							aria-label='Search'
							variant='secondary'
							className='rounded-sm border-0'
						>
							{state.searchLoading ? <Spinner /> : 'Search'}
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
			</form>
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
							<ContextMenu key={track.id}>
								<ContextMenuTrigger asChild>
									<TableRow className='border-0' tabIndex={0}>
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
									<ContextMenuGroup>
										<ContextMenuItem onClick={() => toast.warning('Not available yet')}>
											<SparkleIcon />
											<span>Auto-fit</span>
										</ContextMenuItem>
									</ContextMenuGroup>
									<ContextMenuSeparator />
									<ContextMenuGroup>
										<ContextMenuLabel>Add to playlist</ContextMenuLabel>
										{state.playlists.map(playlist => (
											<ContextMenuCheckboxItem
												key={playlist.id}
												checked={playlist.tracks.includes(track.id)}
												onCheckedChange={async checked => {
													const saving = toast.loading(
														checked ? 'Adding track…' : 'Removing track…'
													)
													try {
														const result = await setTrackInPlaylist(
															playlist.id,
															track.id,
															checked === true
														)
														if ('error' in result) throw new Error(result.error)
														setState(previous => ({
															...previous,
															playlists: previous.playlists.map(item =>
																item.id === playlist.id
																	? {
																		...item,
																		tracks: checked
																			? [
																				...new Set([
																					...item.tracks,
																					track.id,
																				]),
																			]
																			: item.tracks.filter(
																				id => id !== track.id
																			),
																	}
																	: item
															),
														}))
														toast.success(
															checked
																? `Added to ${result.playlistName}`
																: `Removed from ${result.playlistName}`,
															{ id: saving }
														)
													} catch (error) {
														toast.error(
															error instanceof Error
																? error.message
																: 'Couldn’t update this playlist. Please try again.',
															{ id: saving }
														)
													}
												}}
											>
												{playlist.name}
											</ContextMenuCheckboxItem>
										))}
									</ContextMenuGroup>
								</ContextMenuContent>
							</ContextMenu>
						))}
					</TableBody>
				</Table>
			) : (
				<Empty>
					<EmptyHeader>
						<EmptyTitle>{/* Show history */}
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
		</div>
	)
}

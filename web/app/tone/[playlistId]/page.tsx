'use client'

import Loading from '@/app/loading'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { useStates } from '@/hooks/useStates'
import { createClient } from '@/lib/supabase.client'
import { DotIcon, DotsThreeIcon, MusicNoteSimpleIcon, PlayIcon, SmileyXEyesIcon } from '@phosphor-icons/react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { YoutubeVideo } from 'youtube.ts/dist/types'

export default function Page() {
	const { playlistId } = useParams<{ playlistId: string }>()
	const { states, loading, setStates, play } = useStates()
	const [tracks, setTracks] = useState<YoutubeVideo[]>()

	const playlist = states.playlists?.find(
		(self) => self.id === playlistId,
	)

	useEffect(() => {
		if (!playlist?.tracks.length) return

		const timeout = setTimeout(async () => {
			const { items } = await states.youtube.get('video', {
				id: playlist.tracks.join(','),
				part: 'snippet,contentDetails',
			})

			setTracks(items)
		})
		return () => clearTimeout(timeout)
	}, [playlist])

	if (loading || !states.playlists) return <Loading />

	if (!playlist) return (
		<div className='size-full flex flex-col items-center justify-center'>
			<SmileyXEyesIcon className='size-1/2 opacity-10' />
			<p>This playlist could not be found</p>
		</div>
	)

	return (
		<div className="size-full px-[3vw]">
			<div className="flex flex-col justify-evenly mb-[1vh]">
				<h1 className="text-7xl">{playlist.label}</h1>
				<div className="flex items-center gap-[0.5vw]">
					<Button
						size="icon-lg"
						className="rounded-full size-10"
						disabled={!playlist.tracks.length}
						onClick={() => {
							setStates(prev => ({ ...prev, queue: playlist.tracks }))
							play(playlist.tracks[0])
						}}
					>
						<PlayIcon className="size-1/2" weight="fill" />
					</Button>
					<DotIcon />
					<p>{playlist.tracks.length} Track</p>
				</div>
			</div>
			<Separator />
			<div>
				{playlist.tracks.length ? (
					<Table>
						<TableCaption>No more tracks on this playlist.</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead className="w-0 text-center">#</TableHead>
								<TableHead>Title</TableHead>
								<TableHead>Artist</TableHead>
								<TableHead className="w-12" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{playlist.tracks.map((trackId, i) => {
								const track = tracks?.find((track) => track.id === trackId)
								return (
									<TableRow key={trackId} className="group">
										<TableCell>
											<Button
												variant="ghost"
												className="w-7"
												onClick={() => {
													if (!track) return
													
													play(track.id)
												}}
											>
												<span className="group-hover:hidden">{i + 1}</span>
												<PlayIcon className="hidden group-hover:block" weight="fill" />
											</Button>
										</TableCell>
										<TableCell>
											{track ? (
												track.snippet.title
											) : (
												<Skeleton className="w-full h-[2.5vh]" />
											)}
										</TableCell>
										<TableCell>
											{track ? (
												track.snippet.channelTitle
											) : (
												<Skeleton className="w-full h-[2.5vh]" />
											)}
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost">
														<DotsThreeIcon />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent>
													<DropdownMenuGroup>
														<DropdownMenuItem
															variant="destructive"
															onClick={() => {
																const tracks = playlist.tracks.filter(
																	(self) => self !== trackId,
																)

																toast.promise(
																	async () => {
																		const { error } = await createClient()
																			.from('playlists')
																			.update({ tracks })
																			.eq('id', playlist.id)

																		if (error) throw error

																		setStates((prev) => ({
																			...prev,
																			playlists:
																				prev.playlists?.map((p) =>
																					p.id === playlist.id ? { ...p, tracks } : p,
																				) ?? null,
																		}))
																	},
																	{
																		loading: 'Removing...',
																		error: (error) => ({
																			message: 'Error',
																			description: JSON.stringify(error),
																		}),
																		success: 'Removed from playlist.',
																	},
																)
															}}
														>
															Remove
														</DropdownMenuItem>
													</DropdownMenuGroup>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				) : (
					<div className="size-full flex flex-col items-center justify-center">
						<MusicNoteSimpleIcon className="size-1/2 opacity-10" />
						<p>Added tracks to this playlist with show up here</p>
					</div>
				)}
			</div>
		</div>
	)
}

'use client'

import { useApp } from '@/app/tone/provider'
import type { ReactNode } from 'react'
import Link, { useLinkStatus } from 'next/link'
import { useParams } from 'next/navigation'
import {
	ContextMenu,
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
} from '@/components/ui/context-menu'
import {
	Empty,
	EmptyHeader,
	EmptyTitle,
	EmptyDescription,
} from '@/components/ui/empty'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarHeader,
	SidebarRail,
	useSidebar,
} from '@/components/ui/sidebar'
import { AccountMenu, type Account } from './account-menu'
import { CreatePlaylistDialog } from './create-playlist-dialog'
import { ImportSpotifySheet } from './import-spotify-sheet'

function PlaylistLinkLabel({ children }: { children: ReactNode }) {
	const { pending } = useLinkStatus()
	return <span data-pending={pending}>{children}</span>
}

export function PlaylistsSidebar({ account }: { account: Account }) {
	const { state, setState } = useApp()
	const { playlistId } = useParams<{ playlistId?: string }>()
	const { isMobile, setOpenMobile } = useSidebar()
	return (
		<Sidebar
			variant='inset'
			aria-label='Playlists'
			className='h-[calc(100dvh-5rem)]'
		>
			<SidebarHeader className='flex-row items-center justify-between'>
				Playlists
			</SidebarHeader>
			<SidebarContent>
				<ContextMenu>
					<ContextMenuTrigger asChild>
						<SidebarGroup
							className='flex-1'
							tabIndex={0}
							aria-label='Playlists'
						>
							{state.playlists.length === 0 ? (
								<Empty>
									<EmptyHeader>
										<EmptyTitle>No playlists yet</EmptyTitle>
										<EmptyDescription>
											{isMobile
												? 'Touch and hold here to create a playlist.'
												: 'Right-click here to create a playlist.'}
										</EmptyDescription>
									</EmptyHeader>
								</Empty>
							) : (
								<SidebarMenu className='not-typeset'>
									{state.playlists.map(playlist => (
										<SidebarMenuItem key={playlist.id}>
											<ContextMenu>
												<ContextMenuTrigger asChild>
													<SidebarMenuButton
														asChild
														isActive={playlistId === playlist.id}
													>
														<Link
															href={`/tone/playlist/${playlist.id}`}
															className='has-[[data-pending=true]]:cursor-progress'
															aria-current={
																playlistId === playlist.id ? 'page' : undefined
															}
															onClick={() => setOpenMobile(false)}
														>
															<PlaylistLinkLabel>
																{playlist.name}
															</PlaylistLinkLabel>
														</Link>
													</SidebarMenuButton>
												</ContextMenuTrigger>
												<ContextMenuContent>
													<ContextMenuItem
														onSelect={() =>
															setState(previous => ({
																...previous,
																playlistAction: { type: 'rename', ...playlist },
															}))
														}
													>
														Rename
													</ContextMenuItem>
													<ContextMenuItem
														variant='destructive'
														onSelect={() =>
															setState(previous => ({
																...previous,
																playlistAction: { type: 'delete', ...playlist },
															}))
														}
													>
														Delete
													</ContextMenuItem>
												</ContextMenuContent>
											</ContextMenu>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							)}
						</SidebarGroup>
					</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuItem
							onSelect={() =>
								setState(previous => ({ ...previous, newPlaylistOpen: true }))
							}
						>
							Create new playlist
						</ContextMenuItem>
						<ContextMenuItem
							onSelect={() =>
								setState(previous => ({ ...previous, spotifyImportOpen: true }))
							}
						>
							Import from Spotify
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
			</SidebarContent>
			<CreatePlaylistDialog />
			<ImportSpotifySheet />
			<AccountMenu account={account} />
			<SidebarRail
				aria-label='Toggle playlists'
				title='Toggle playlists (Ctrl+B)'
				aria-keyshortcuts='Control+b'
				className='after:inset-y-2 after:w-4 after:rounded-l-xl after:border-y-2 after:border-l-2 after:border-transparent hover:after:border-sidebar-border hover:after:bg-transparent'
			/>
		</Sidebar>
	)
}

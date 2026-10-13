import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '../ui/sidebar'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase.client'
import { Skeleton } from '@/components/ui/skeleton'
import { Thumbnail } from '@/components/thumbnail'
import { useStates } from '@/hooks/useStates'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import dayjs from 'dayjs'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import {
	CaretUpDownIcon,
	EnvelopeSimpleIcon,
	InfoIcon,
	PlaylistIcon,
	PlusIcon,
} from '@phosphor-icons/react'
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '../ui/item'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Lead } from '../typography'
import { Fragment } from 'react/jsx-runtime'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Spinner } from '../ui/spinner'
import { useEffect, useRef, useState } from 'react'
import {
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
	EmptyContent,
	Empty,
} from '../ui/empty'
import { Database } from '@/lib/supabase.types'

dayjs.extend(relativeTime)
const format = (value: string | undefined, accurate?: true) =>
	dayjs(value).format(`${accurate ? 'H:M ' : ''}MMMM D, YYYY`)

export const AppSidebar = () => {
	const { states, setStates } = useStates()
	const [playlists, setPlaylists] = useState<Database['public']['Tables']['playlists']['Row'][]>()
	const [dialogOpen, setDialog] = useState(false)
	const playlistInput = useRef<HTMLInputElement>(null)

	useEffect(() => {
		const timeout = setTimeout(async () => {
			const { error, data } = await createClient().from('playlists').select('*')

			if (error) {
				toast.error('Error', {
					description: JSON.stringify(error),
				})
				return
			}

			setPlaylists(data)
		})

		return () => clearTimeout(timeout)
	}, [states.user])

	return (
		<Fragment>
			<Sidebar variant="inset">
				<SidebarHeader className="flex-row justify-between">
					<Lead>Playlists</Lead>
					<Dialog open={dialogOpen} onOpenChange={setDialog}>
						<DialogTrigger asChild>
							<Button
								variant="ghost"
								size="icon-xs"
							>
								<PlusIcon />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create new playlist</DialogTitle>
								<DialogDescription className="flex flex-col gap-[1vh]">
									<Label htmlFor="playlist_name">Playlist name</Label>
									<Input
										id="playlist_name"
										defaultValue="My Playlist"
										ref={playlistInput}
									/>
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button
									className="w-full"
									onClick={async () => {
										const label = playlistInput.current?.value
										if (!label || label.length < 3) {
											toast.warning('Warning', {
												description: 'Playlist name must be at least 3 characters long.'
											})
											return
										}
										if (!states.user) {
											return
										}
										try {
											const { error, data } = await createClient()
											.from('playlists')
											.insert({
												label,
												tracks: []
											})
											.select('*')
											
											if (error) {
												toast.error('Error', {
													description: JSON.stringify(error)
												})
												return
											}

											setPlaylists(data)
										} finally {
											setDialog(false)
										}
									}}
								>Create</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</SidebarHeader>
				<SidebarContent>
					{playlists ? (
						playlists.length ? (
							<SidebarGroup>
								{playlists.map(playlist => (
									<SidebarMenuItem key={playlist.id}>
										<SidebarMenuButton variant="outline">
											{playlist.label}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarGroup>
						) : (
							<div className="flex h-full justify-center items-center">
								<Empty className="px-0">
									<EmptyHeader>
										<EmptyMedia variant="icon">
											<PlaylistIcon />
										</EmptyMedia>
										<EmptyTitle>No playlists</EmptyTitle>
										<EmptyDescription>
											You haven't created any playlist yet. Get started by creating your
											first playlist
										</EmptyDescription>
									</EmptyHeader>
									<EmptyContent>
										<Button onClick={() => setDialog(true)}>Create playlist</Button>
									</EmptyContent>
								</Empty>
							</div>
						)
					) : (
						<div className="flex h-full justify-center items-center">
							<Spinner />
						</div>
					)}
				</SidebarContent>
				<SidebarFooter>
					{states.user === undefined ? (
						<Skeleton className="h-[5vh] w-[5vh] rounded-full" />
					) : states.user ? (
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									size="lg"
									className="justify-between py-[2.5vh]"
								>
									<div className="flex gap-[0.5vw] items-center">
										<Thumbnail size="sm" src={states.user.user_metadata.avatar_url} />
										<p className="text-foreground">{states.user.user_metadata.name}</p>
									</div>
									<CaretUpDownIcon />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start">
								<Item variant="muted">
									<ItemMedia>
										<Thumbnail size="sm" src={states.user.user_metadata.avatar_url} />
									</ItemMedia>
									<ItemContent>
										<ItemTitle>{states.user.user_metadata.full_name}</ItemTitle>
										<ItemDescription>
											<span className="font-bold">User Since: </span>
											<span>{format(states.user.created_at)}</span>
										</ItemDescription>
									</ItemContent>
								</Item>
								<Item variant="outline">
									<ItemMedia variant="icon">
										<EnvelopeSimpleIcon />
									</ItemMedia>
									<ItemContent>
										<ItemTitle>Email</ItemTitle>
										<ItemDescription>{states.user.email}</ItemDescription>
									</ItemContent>
									<ItemActions>
										<HoverCard>
											<HoverCardTrigger>
												<InfoIcon />
											</HoverCardTrigger>
											<HoverCardContent side="right">
												<p>
													Registered using <b>{states.user.app_metadata.provider}</b>
												</p>
											</HoverCardContent>
										</HoverCard>
									</ItemActions>
								</Item>
								{states.user.last_sign_in_at && (
									<p>
										<span className="font-bold">Last sign in: </span>
										<span>
											{dayjs(states.user.last_sign_in_at).fromNow()} (
											{format(states.user.last_sign_in_at, true)})
										</span>
									</p>
								)}
								<Button
									variant="destructive"
									onClick={async () => {
										toast.promise(
											async () => {
												const { error } = await createClient().auth.signOut({
													scope: 'local',
												})
												if (error) throw error

												setStates((prev) => ({ ...prev, user: null }))
											},
											{
												loading: 'Signing out...',
												error: (error) => error,
												success: 'Signed out',
											},
										)
									}}
								>
									Sign out
								</Button>
							</PopoverContent>
						</Popover>
					) : (
						<Button
							onClick={() => {
								createClient().auth.signInWithOAuth({
									provider: 'google',
									options: {
										redirectTo: `${window.location.origin}/auth/callback`,
									},
								})
							}}
						>
							Continue with Goggle
						</Button>
					)}
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
		</Fragment>
	)
}

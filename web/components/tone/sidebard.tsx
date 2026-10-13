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
import { EnvelopeSimpleIcon, InfoIcon } from '@phosphor-icons/react'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../ui/item'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
const format = (value: string | undefined, accurate?: true) => dayjs(value).format(`${accurate ? 'H:M ' : ''}MMMM D, YYYY`)

export const AppSidebar = () => {
	const { states, setStates } = useStates()

	return (
		<Sidebar variant='inset'>
			<SidebarHeader>Playlists</SidebarHeader>
			<SidebarContent></SidebarContent>
			<SidebarFooter>
				{states.user === undefined ? (
					<Skeleton className="h-[5vh] w-[5vh] rounded-full" />
				) : states.user ? (
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" size='lg' className='justify-between py-[2.5vh]'>
								<div className='flex gap-[0.5vw] items-center'>
								<Thumbnail size='sm' src={states.user.user_metadata.avatar_url} />
								<p className='text-foreground'>{states.user.user_metadata.name}</p>
								</div>
								<CaretUpDownIcon />
							</Button>
						</PopoverTrigger>
						<PopoverContent align='start'>
							<Item variant='muted'>
								<ItemMedia>
									<Thumbnail size='sm' src={states.user.user_metadata.avatar_url} />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>{states.user.user_metadata.full_name}</ItemTitle>
									<ItemDescription>
										<span className='font-bold'>User Since: </span>
										<span>{format(states.user.created_at)}</span>
									</ItemDescription>
								</ItemContent>
							</Item>
							<Item variant='outline'>
								<ItemMedia variant='icon'>
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
										<HoverCardContent side='right'>
											<p>Registered using <b>{states.user.app_metadata.provider}</b></p>
										</HoverCardContent>
									</HoverCard>
								</ItemActions>
							</Item>
							{states.user.last_sign_in_at && (
								<p>
									<span className='font-bold'>Last sign in: </span>
									<span>{dayjs(states.user.last_sign_in_at).fromNow()} ({format(states.user.last_sign_in_at, true)})</span>
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
	)
}

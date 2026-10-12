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
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { useStates } from '@/hooks/useStates'
import { toast } from 'sonner'

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
					<HoverCard openDelay={20} closeDelay={20}>
						<HoverCardTrigger>
							<Thumbnail src={states.user.user_metadata.avatar_url} />
						</HoverCardTrigger>
						<HoverCardContent className="w-fit">
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
						</HoverCardContent>
					</HoverCard>
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

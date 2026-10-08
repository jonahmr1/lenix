'use client'

import { Button } from '@/components/ui/button'
import { Player } from '@/components/tone/player'
import { Search } from '@/components/tone/search'
import { createClient } from '@/lib/supabase.client'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStates } from '@/hooks/useStates'
import StatesProvider from './provider'
import { Thumbnail } from '@/components/thumbnail'

export default function Page() {
	return (
		<StatesProvider>
			<Tone />
		</StatesProvider>
	)
}

const Tone = () => {
	const { states } = useStates()

	return (
		<div className="h-screen w-full">
			<div className="size-full flex flex-col justify-between px-[5vw] py-[5vh]">
				<div className="flex flex-col portrait:items-center">
					<div className="flex portrait:flex-wrap items-center justify-between *:mt-0 gap-[3vw] *:flex-1">
						<h1>Tonelix</h1>
						<div className="portrait:order-1 w-1/2 portrait:w-full flex justify-center">
							<Search />
						</div>
						<div className="flex justify-end">
							{states.user === undefined ? (
								<Skeleton className="h-[5vh] w-[5vh] rounded-full" />
							) : states.user ? (
								<Thumbnail src={states.user.user_metadata.avatar_url} />
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
						</div>
					</div>
					{/* input will be here in portrait mode */}
				</div>
			</div>
			<Player />
		</div>
	)
}

'use client'

import { Player } from '@/components/tone/player'
import { Search } from '@/components/tone/search'
import StatesProvider from './provider'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { AppSidebar } from '@/components/tone/sidebard'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar'
import { MusicNotesSimpleIcon } from '@phosphor-icons/react'

export default function Page() {
	return (
		<StatesProvider>
			<Tone />
		</StatesProvider>
	)
}

const Tone = () => {
	useEffect(() => {
		if (
			new URLSearchParams(location.search).get('auth-code-error') === 'sign_in'
		) {
			toast.error('Google sign-in failed. Please try again.', {
				id: 'sign-in-error',
			})
			history.replaceState(history.state, '', location.pathname + location.hash)
		}
	}, [])

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="relative overflow-hidden">
				<div className="size-full flex flex-col *:flex-1 *:min-h-0">
					<SidebarTrigger className='absolute z-2 left-1/100 top-1/50' />
					<div className="flex justify-center z-1 pt-[5vh]">
						<Search />
					</div>
					<div className="flex size-full flex-col items-center">
						<div className="relative min-h-0 w-full flex-1">
							<MusicNotesSimpleIcon className="absolute inset-0 size-full opacity-10" />
						</div>
						<p>
							Nothing to show here, <b>Play</b> from your playlists or <b>search</b>{' '}
							for what you want to play
						</p>
					</div>
					<div></div>
				</div>
				<Player />
			</SidebarInset>
		</SidebarProvider>
	)
}

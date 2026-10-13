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
import { Kbd } from '@/components/ui/kbd'

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
				<div className="w-full h-screen flex flex-col *:flex-1 *:min-h-0">
					<div className='flex items-start pt-[2vh] px-[2vw]'>
						<div className='flex flex-1 items-center *:flex-1'>
							<div>
								<SidebarTrigger />
							</div>
							<div className="flex flex-5! justify-center z-1">
								<Search />
							</div>
							<div></div>
						</div>
					</div>
					<div className="flex size-full flex-col items-center">
						<div className="relative min-h-0 w-full flex-1">
							<MusicNotesSimpleIcon className="absolute inset-0 size-full opacity-10" />
						</div>
						<div className='px-[5vw]'>
							<div className='flex gap-[0.5vw]'>
								<p><b>Play</b> from your playlists</p>
								<Kbd>{navigator.platform.startsWith('Mac') ? '⌘' : 'Ctrl'}</Kbd>
								<Kbd>B</Kbd>
							</div>
							<div className='flex gap-[0.5vw]'>
								<p><b>Search</b> for what you want to play</p>
								<Kbd>{navigator.platform.startsWith('Mac') ? '⌘' : 'Ctrl'}</Kbd>
								<Kbd>K</Kbd>
							</div>
						</div>
					</div>
					<div></div>
				</div>
				<Player />
			</SidebarInset>
		</SidebarProvider>
	)
}

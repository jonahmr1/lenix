'use client'

import { Player } from '@/components/tone/player'
import { Search } from '@/components/tone/search'
import StatesProvider from './provider'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { AppSidebar } from '@/components/tone/sidebard'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function Page() {
	return (
		<StatesProvider>
			<Tone />
		</StatesProvider>
	)
}

const Tone = () => {
	useEffect(() => {
    if (new URLSearchParams(location.search).get('auth-code-error') === 'sign_in') {
      toast.error('Google sign-in failed. Please try again.', {
        id: 'sign-in-error',
      })
			history.replaceState(history.state, '', location.pathname + location.hash)
    }
  }, [])

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className='relative'>
				<div className="size-full flex flex-col justify-between px-[5vw] py-[5vh]">
					<div className="flex flex-col portrait:items-center">
						<div className="flex portrait:flex-wrap items-center justify-between *:mt-0 gap-[3vw] *:flex-1">
							<div className='flex items-center gap-[2vw]'>
								<h1>Tonelix</h1>
							</div>
							<div className="portrait:order-1 w-1/2 portrait:w-full flex justify-center">
								<Search />
							</div>
						</div>
						{/* input will be here in portrait mode */}
					</div>
				</div>
				<Player />
			</SidebarInset>
		</SidebarProvider>
	)
}

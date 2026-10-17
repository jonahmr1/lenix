'use client'

import { toast } from 'sonner'
import { useEffect } from 'react'
import { MusicNotesSimpleIcon } from '@phosphor-icons/react'
import { Kbd } from '@/components/ui/kbd'
import { useStates } from '@/hooks/useStates'
import Loading from '../loading'

export default function Page() {
	const { loading } = useStates()
	
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

	if (loading) return <Loading />

	return (
		<div className='size-full flex flex-col items-center justify-center'>
			<div>
				<MusicNotesSimpleIcon className="flex-1 size-full opacity-10" />
				<div className='px-[5vw] flex gap-[3vw]'>
					<div className='flex flex-col gap-[0.5vw]'>
						<p><b>Play</b> from your playlists</p>
						<p><b>Search</b> for what you want to play</p>
					</div>
					<div className='flex flex-col gap-[0.5vw] *:space-x-[0.5vw]'>
						<div>
							<Kbd>{navigator.platform.startsWith('Mac') ? '⌘' : 'Ctrl'}</Kbd>
							<Kbd>B</Kbd>
						</div>
						<div>
							<Kbd>{navigator.platform.startsWith('Mac') ? '⌘' : 'Ctrl'}</Kbd>
							<Kbd>K</Kbd>
						</div>
					</div>
				</div>
			</div>
			<div className='flex-1' />
		</div>
	)
}

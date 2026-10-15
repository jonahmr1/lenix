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
		<>
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
		</>
	)
}

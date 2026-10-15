'use client'

import Loading from '@/app/loading'
import { useStates } from '@/hooks/useStates'
import { SmileyXEyesIcon } from '@phosphor-icons/react'
import { useParams } from 'next/navigation'

export default function Page() {
	const { playlistId } = useParams<{ playlistId: string }>()
	const { states, loading } = useStates()

	if (loading || !states.playlists) return <Loading />

	const playlist = states.playlists.find(
		(self) => self.id === playlistId,
	)

	if (!playlist) return (
		<div className='size-full flex flex-col items-center justify-center'>
			<SmileyXEyesIcon className='size-1/2 opacity-10' />
			<p>This playlist could not be found</p>
		</div>
	)

	return (
		<div>
			<h1>{playlist.label}</h1>
			{playlist.tracks.length ? (
				<ul>
					{playlist.tracks.map((track, index) => (
						<li key={index}>{track}</li>
					))}
				</ul>
			) : (
				<p>No tracks yet.</p>
			)}
		</div>
	)
}

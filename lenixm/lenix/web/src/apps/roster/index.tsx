import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import type { Events, Officers, OfficerUpdates, Requests } from 'types'
import { Officer } from './officer'
import { DEV } from '@/App'
import { Frown } from 'lucide-react'
import { focus, onEvent, triggerNui } from 'lenix/nui'

export const Roster = () => {
	const [display, setDisplay] = useState<boolean>(DEV)
	const [officers, setOfficers] = useState<Officers>({
		// 1: {
		// 	playerId: 1,
		// 	name: 'Marwan Jonah',
		// 	callsign: 'D-35',
		// 	duty_state: 'off',
		// 	talk_state: 'off'
		// }
	})
	const [playerId, setPlayerId] = useState<number>()

	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return

			focus()
		}
		window.addEventListener('keydown', handler)

		const disposes = [
			onEvent<Events['displayRoster']>('roster:display', (state, playerId) => {
				setDisplay(state)
				setPlayerId(playerId)
				console.debug({ state })
			}),
			onEvent<Events['refreshOfficers']>('roster:refreshOfficers', setOfficers),
		]

		return () => {
			window.removeEventListener('keydown', handler)
			disposes.forEach(dispose => dispose())
		}
	}, [])

	if (!playerId) return

	const updateOfficer = (playerId: number, updates: OfficerUpdates) => {
		triggerNui<Requests['updateOfficer']>('roster:updateOfficer', {
			playerId,
			...updates,
		})
	}

	const handleSignin = () => {
		const state = officers[playerId].duty_state
		if (state === 'off') return updateOfficer(playerId, { duty_state: 'on' })
		if (state === 'on') return updateOfficer(playerId, { duty_state: 'off' })

		updateOfficer(playerId, { duty_state: 'off' })
	}

	const handleBreak = () => {
		const state = officers[playerId].duty_state
		if (state === 'off') return
		if (state === 'break') return updateOfficer(playerId, { duty_state: 'on' })

		updateOfficer(playerId, { duty_state: 'break' })
	}

	const handleCallsign = () => {
		focus()
		triggerNui<Requests['triggerCallsign']>('roster:callsign')
	}

	return (
		<div
			inert={!display}
			className={`absolute top-1/5 right-1/10 w-2/10 h-2/4 flex flex-col bg-zinc-900 rounded-lg ${display ? 'opacity-100' : 'opacity-0'}`}
		>
			<div className='flex-1 min-h-0 px-5 pt-5 flex flex-col gap-3'>
				<div className='flex flex-col gap-2'>
					<div className='w-full flex justify-between items-center'>
						<p className='text-white cursor-default'>Active Officers</p>
						<div className='flex items-center gap-4'>
							<div>
								<Separator orientation='vertical' className='h-4 bg-gray-600' />
							</div>
							<p className='text-white cursor-default'>{Object.entries(officers).length}</p>
						</div>
					</div>
				</div>
				<Separator className='bg-gray-600' />
				<div className='flex-1 min-h-0 overflow-y-auto scrollbar-none flex flex-col items-center'>
					{Object.entries(officers).length ? (
						Object.entries(officers).map(([playerId, officer]) => <Officer key={playerId} {...officer} />)
					) : (
						<div className='h-full flex flex-col justify-center items-center gap-5'>
							<Frown className='text-white' size={60} />
							<p className='text-white'>No officer found!</p>
						</div>
					)}
				</div>
			</div>
			{officers[playerId] ? (
				<div className='flex'>
					<Button
						variant='outline'
						className='flex-1 rounded-none rounded-bl-lg bg-transparent text-white border-white/10'
						onClick={handleSignin}
					>
						{officers[playerId].duty_state === 'off' ? 'Sign-in' : 'Sign-off'}
					</Button>
					<Button
						variant='outline'
						className='flex-1 rounded-none bg-transparent border-x-0 text-white border-white/10'
						onClick={handleBreak}
					>
						{officers[playerId].duty_state === 'on'
							? 'Take Break'
							: officers[playerId].duty_state === 'off'
								? 'Take Break'
								: 'Sign-in'}
					</Button>
					<Button
						variant='outline'
						className='flex-1 rounded-none rounded-br-lg bg-transparent text-white border-white/10'
						onClick={handleCallsign}
					>
						Callsign
					</Button>
				</div>
			) : (
				<div></div>
			)}
		</div>
	)
}

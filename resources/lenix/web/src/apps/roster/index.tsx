import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import type { Events, Officer as IOfficer, Officers, OfficerUpdates, Requests } from 'types'
import { Officer } from './officer'
import { onEvent, triggetNui } from '@/lib'
import { DEV } from '@/index'

export const Roster = () => {
	const [display, setDisplay] = useState<boolean>(DEV)
	const [officers, setOfficers] = useState<Officers>({})
	const [playerId, setPlayerId] = useState<number>()

	const updatePlayerId = async () => setPlayerId(await triggetNui<Requests['getPlayerId']>('roster:getPlayerId'))

	useEffect(() => {
		updatePlayerId()

		const handler = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return

			triggetNui<Requests['loseFocus']>('roster:lostFocus')
		}
		window.addEventListener('keydown', handler)

		return () => window.removeEventListener('keydown', handler)
	})

	onEvent<Events['displayRoster']>('roster:display', setDisplay)
	onEvent<Events['refreshOfficers']>('roster:refreshOfficers', setOfficers)

	if (!playerId || !officers[playerId]) return

	const updateOfficer = (playerId: number, updates: OfficerUpdates) => {
		triggetNui<Requests['updateOfficer']>('roster:updateOfficer', {
			playerId,
			...updates
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

	const handleCallsign = () => { }

	return (
		<div
			inert={!display}
			className={`absolute top-1/5 right-1/10 w-2/10 h-2/4 flex flex-col bg-black rounded-lg ${display ? 'opacity-100' : 'opacity-0'}`}
		>
			<div className='flex-1 min-h-0 px-5 pt-5 flex flex-col gap-3'>
				<div className='flex flex-col gap-2'>
					<div className='w-full flex justify-between items-center'>
						<div className='text-white cursor-default'>Active Officers</div>
						<div className='flex items-center gap-4'>
							<div>
								<Separator orientation='vertical' className='h-4 bg-gray-600' />
							</div>
							<div className='text-white cursor-default'>{Object.entries(officers).length}</div>
						</div>
					</div>
				</div>
				<Separator className='bg-gray-600' />
				<div className='flex-1 min-h-0 overflow-y-auto scrollbar-none flex flex-col'>
					{Object.entries(officers).map(([, officer]) => (
						<Officer {...officer} />
					))}
				</div>
			</div>
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
		</div>
	)
}

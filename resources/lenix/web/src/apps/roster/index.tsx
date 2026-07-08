import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import type { Events, Officer as IOfficer, Officers, OfficerUpdates, Requests } from 'types'
import { Officer } from './officer'
import { onEvent, triggetNui } from '@/lib'

export const Roster = () => {
	const [display, setDisplay] = useState<boolean>(true)
	const [officers, setOfficers] = useState<Officers>({
		1: {
			playerId: 1,
			callsign: 'A-35',
			name: 'Marwan Jonah',
			duty_state: 'off',
			talk_state: 'off',
		}}
	)
	let myCharId: number = 1

	onEvent<Events['displayRoster']>('roster:display', setDisplay)
	onEvent<Events['addOfficer']>('roster:addOfficer', (officer) => setOfficers(prev => ({ ...prev, officer })))
	onEvent<Events['updateOfficers']>('roster:updateOfficers', (officers) => setOfficers(officers))

	const updateOfficer = (playerId: number, updates: OfficerUpdates) => {
		triggetNui<Requests['updateOfficer']>('roster:updateOfficer', {
			playerId,
			...updates
		})
	}

	const getOfficer = (playerId: number): IOfficer => officers[playerId]

	const handleSignin = () => {
		const state = getOfficer(myCharId).duty_state
		if (state === 'off') return updateOfficer(myCharId, { duty_state: 'on' })
		if (state === 'on') return updateOfficer(myCharId, { duty_state: 'off' })

		updateOfficer(myCharId, { duty_state: 'off' })
	}

	const handleBreak = () => {
		const state = getOfficer(myCharId).duty_state
		if (state === 'off') return
		if (state === 'break') return updateOfficer(myCharId, { duty_state: 'on' })

		updateOfficer(myCharId, { duty_state: 'break' })
	}

	const handleCallsign = () => { }

	return (
		<div
			inert={!display}
			className={`absolute top-1/5 right-1/10 w-5/10 h-3/4 flex flex-col bg-zinc-900 rounded-lg opacity-${display ? '100' : '0'}`}
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
					{getOfficer(myCharId).duty_state === 'off' ? 'Sign-in' : 'Sign-off'}
				</Button>
				<Button
					variant='outline'
					className='flex-1 rounded-none bg-transparent border-x-0 text-white border-white/10'
					onClick={handleBreak}
				>
					{getOfficer(myCharId).duty_state === 'on'
						? 'Take Break'
						: getOfficer(myCharId).duty_state === 'off'
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

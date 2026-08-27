import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import type { Events, Officers, OfficerUpdates, Requests } from 'types'
import { DEV } from '@/App'
import { Frown } from 'lucide-react'
import { focus, onNuiEmit, fetchNui } from 'lenix/nui'
import { Badge } from '@/components/ui/badge'
import { AudioLines } from 'lucide-react'
import type { DutyState, Officer as IOfficer, TalkState } from 'types'

const TalkStates: Record<TalkState, string> = {
	on: 'text-blue-400',
	off: 'text-gray-500',
}

const DutyStates: Record<DutyState, string> = {
	on: 'bg-green-500',
	off: 'bg-red-500',
	break: 'bg-orange-500',
}

const Officer = ({ callsign, name, duty_state, talk_state }: IOfficer) => (
	<div className='w-full min-h-1/10 flex justify-around items-center'>
		<div className='flex-3 flex gap-3 items-center'>
			<div>
				<Badge className={`size-3 rounded-full p-0 ${DutyStates[duty_state]}`} />
			</div>
			<div className='text-white/70 whitespace-nowrap font-extralight text-[2vmin]'>{callsign}</div>
		</div>
		<div className='p-1 flex-1 flex justify-center'>
			<Separator orientation='vertical' className='h-4 bg-gray-600' />
		</div>
		<div className='flex-8 flex justify-between'>
			<div className='text-white text-left text-[2vmin] truncate'>{name}</div>
			<Badge className='hidden'>
				{/* TODO */}
				<AudioLines className={`${TalkStates[talk_state]}`} />
			</Badge>
		</div>
	</div>
)

export const Roster = () => {
	const [display, setDisplay] = useState<boolean>(DEV)
	const [officers, setOfficers] = useState<Officers>({})
	const [playerId, setPlayerId] = useState<number>(1)

	useEffect(() => {
		if (DEV) {
			setOfficers({
				1: {
					playerId: 1,
					name: 'Marwan Jonah',
					callsign: 'D-35',
					duty_state: 'off',
					talk_state: 'off'
				}
			})
			return
		}
		const handler = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return

			focus()
		}
		window.addEventListener('keydown', handler)

		const disposes = [
			onNuiEmit<Events['displayRoster']>('roster:display', (state, playerId) => {
				setDisplay(state)
				setPlayerId(playerId)
			}),
			onNuiEmit<Events['refreshOfficers']>('roster:refreshOfficers', setOfficers),
		]

		return () => {
			window.removeEventListener('keydown', handler)
			disposes.forEach(dispose => dispose())
		}
	}, [])

	if (!playerId) return

	const updateOfficer = (playerId: number, updates: OfficerUpdates) => {
		fetchNui<Requests['updateOfficer']>('roster:updateOfficer', {
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
		fetchNui<Requests['triggerCallsign']>('roster:callsign', {})
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
			{officers[playerId] && (
				<div className='flex w-full min-w-0 *:flex-1 *:min-w-0 *:overflow-hidden *:rounded-none *:bg-transparent *:text-[1.5vmin] *:border-white/10 *:text-white'>
					<Button
						variant='outline'
						className='rounded-bl-lg'
						onClick={handleSignin}
					>
						{officers[playerId].duty_state === 'off' ? 'Sign-in' : 'Sign-off'}
					</Button>
					<Button
						variant='outline'
						className='rounded-none border-x-0'
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
						className='rounded-br-lg'
						onClick={handleCallsign}
					>
						Callsign
					</Button>
				</div>
			)}
		</div>
	)
}

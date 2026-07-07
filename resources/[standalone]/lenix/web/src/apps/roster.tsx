import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { AudioLines } from 'lucide-react';
import { useEffect, useState } from "react";

interface Officer {
	unit: string
	name: string
	duty_state: keyof typeof DutyStates
	talk_state:  keyof typeof TalkStates
}

const TalkStates = {
	on: 'text-blue-400',
	off: 'text-gray-500'
}

const DutyStates = {
	on: 'bg-green-500',
	off: 'bg-red-500',
	break: 'bg-orange-500',
}

const Officer = ({ unit, name, duty_state, talk_state }: Officer) => (
	<div className="w-full min-h-1/10 flex justify-around items-center">
		<div className="flex-3 flex gap-3">
			<Badge className={`${DutyStates[duty_state]}`} />
			<div className="text-white/70 whitespace-nowrap font-extralight">{unit}</div>
		</div>
		<div className='py-1 flex-1 flex justify-center'>
			<Separator orientation="vertical" className='h-4 bg-gray-600' />
		</div>
		<div className="flex-8 flex justify-between">
			<div className="text-white text-left">{name}</div>
			<Badge>
				<AudioLines className={`${TalkStates[talk_state]}`} />
			</Badge>
		</div>
	</div>
)

export const Roster = () => {
	const [display, setDisplay] = useState<boolean>(true)
	const [officers, setOfficers] = useState<Officer[]>([
		{
			unit: 'A-35',
			name: 'Marwan Jonah',
			duty_state: 'on',
			talk_state: 'on'
		},
		{
			unit: 'U-0',
			name: 'Marwan Jonah',
			duty_state: 'break',
			talk_state: 'off'
		},
		{
			unit: 'U-00',
			name: 'Marwan Jonah',
			duty_state: 'break',
			talk_state: 'off'
		},
	])

	useEffect(() => {
		const handler = (event: MessageEvent) => {
			const { key, value }: {
				key: 'roster:display'
				value: boolean
			} = event.data
			key === 'roster:display' && setDisplay(value)
		}

		window.addEventListener('message', handler)
		return () => {
			window.removeEventListener('message', handler)
		}
	}, [])

	return (
		<div inert={!display} className={`absolute gap-3 top-1/5 right-1/10 w-5/10 h-3/4 flex flex-col bg-zinc-900 rounded-lg opacity-${display ? '100' : '0'}`}>
			<div className="h-full px-5 pt-5 flex flex-col gap-3">
				<div className="flex flex-col gap-2">
					<div className="w-full flex justify-between items-center">	
						<div className="text-white cursor-default">
							Active Officers	
						</div>
						<div className="flex items-center gap-4">
							<div>
								<Separator orientation="vertical" className="h-4 bg-gray-600" />
							</div>
							<div className="text-white cursor-default">{officers.length}</div>
						</div>
					</div>
				</div>
				<Separator className="bg-gray-600" />
				<div className="scrollbar-none flex flex-col gap-3">
					{officers.map(officer => <Officer {...officer} />)}
				</div>
			</div>
			<div className="flex">
				<Button
					variant="outline"
					className="flex-1 rounded-none rounded-bl-lg bg-transparent text-white border-white/10"
				>
					Sign-in
				</Button>

				<Button
					variant="outline"
					className="flex-1 rounded-none bg-transparent border-x-0 text-white border-white/10"
				>
					Take a Break
				</Button>

				<Button
					variant="outline"
					className="flex-1 rounded-none rounded-br-lg bg-transparent text-white border-white/10"
				>
					Callsign
				</Button>
			</div>
		</div>
	)
}
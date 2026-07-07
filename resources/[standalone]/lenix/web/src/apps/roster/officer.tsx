import { Separator } from "@base-ui/react/separator";
import { Badge, AudioLines } from "lucide-react";
import type { DutyState, Officer as IOfficer, TalkState } from "types";

const TalkStates: Record<TalkState, string> = {
	on: 'text-blue-400',
	off: 'text-gray-500'
}

const DutyStates: Record<DutyState, string> = {
	on: 'bg-green-500',
	off: 'bg-red-500',
	break: 'bg-orange-500',
}

export const Officer = ({ unit, name, duty_state, talk_state }: IOfficer) => (
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
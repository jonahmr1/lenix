import { useState } from "react"
import { DEV } from ".."
import { onEvent } from "@/lib"
import type { Events } from "types"

interface Clip {
	clip: string
}

interface Reserve {
	reserve: string
}

interface UpdateValue extends Clip, Reserve { }

export default () => {
	const [state, setState] = useState<UpdateValue>({
		clip: '-',
		reserve: '-'
	})
	const [display, setDisplay] = useState<boolean>(DEV)

	onEvent<Events['displayHud']>('hud:display', setDisplay)
	onEvent<Events['updateHudClip']>('hud:update:clip', (clip) => setState(prev => ({ clip, reserve: prev.reserve })))
	onEvent<Events['updateHudReserve']>('hud:update:reserve', (reserve) => setState(prev => ({ reserve, clip: prev.clip })))

	return (
		<div className={`absolute w-full flex justify-end p-5 ${display ? 'opacity-100' : 'opacity-0'}`}>
			<div className="flex gap-1 items-end">
				<div className="text-white font-[Saira] text-3xl font-bold">{state.clip}</div>
				<div className="text-white/50 text-xl font-[Saira]">{state.reserve}</div>
			</div>
		</div>
	)
}
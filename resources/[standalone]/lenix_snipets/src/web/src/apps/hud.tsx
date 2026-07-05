import { useEffect, useState } from "react"
import { DEV } from ".."

interface Clip {
	clip: string
}

interface Reserve {
	reserve: string
}

interface UpdateValue extends Clip, Reserve {}

export default () => {
	const [state, setState] = useState<UpdateValue>({
		clip: '-',
		reserve: '-'
	})
	const [display, setDisplay] = useState<boolean>(DEV)

	useEffect(() => {
		const handler = (event: MessageEvent) => {
			const { key, value }: {
				key: 'hud:update:reserve'
				value: Reserve
			} | {
				key: 'hud:update:clip'
				value: Clip
			} | {
				key: 'hud:display'
				value: boolean
			} = event.data
			key === 'hud:display' && setDisplay(value)
			key === 'hud:update:clip' && setState(prev => ({ clip: value.clip, reserve: prev.reserve }))
			key === 'hud:update:reserve' && setState(prev => ({ reserve: value.reserve, clip: prev.clip }))
		}
		
		window.addEventListener('message', handler)
		return () => window.removeEventListener('message', handler)
	}, [])

	return (
		<div className={`absolute w-full flex justify-end p-5 ${display ? 'opacity-100' : 'opacity-0'}`}>
			<div className="flex gap-1 items-end">
				<div className="text-white font-[Saira] text-3xl font-bold">{state.clip}</div>
				<div className="text-white/50 text-xl font-[Saira]">{state.reserve}</div>
			</div>
		</div>
	)
}
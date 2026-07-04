import { useState } from "react"

export default () => {
	const [state, setState] = useState<{
		clip: number
		reserve: number
	}>()
	const [display, setDisplay] = useState<boolean>(true)

	window.addEventListener('message', (event: MessageEvent) => {
		const { key, value } = event.data
		key === 'display' && setDisplay(value)
		key === 'update' && setState(value)
	})

	return (
		<div className={`w-full flex justify-end p-10 ${display ? 'opacity-100' : 'opacity-0'}`}>
			<div className="flex gap-1 items-end">
				<div className="text-white font-[Saira] text-4xl font-bold">{state?.clip ?? '-'}</div>
				<div className="text-white/50 text-2xl font-[Saira]">{state?.reserve ?? '-'}</div>
			</div>
		</div>
	)
}
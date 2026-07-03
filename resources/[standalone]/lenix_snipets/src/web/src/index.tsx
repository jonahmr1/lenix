import { useState } from "react"

export default () => {
	const [{
		clip, reserve
	}, _setState] = useState<{
		clip: number
		reserve: number
	}>({
		clip: 0,
		reserve: 0
	})
	const [display, setDisplay] = useState<boolean>(true)

	window.addEventListener('message', (event: MessageEvent) => {
		const { state } = event.data
		setDisplay(state)
	})

	return (
		<div className={`w-full flex justify-end p-5 ${display ? 'opacity-100' : 'opacity-0'}`}>
			<div className="flex gap-1 items-end">
				<div className="text-white font-[Saira] text-3xl font-bold">{clip}</div>
				<div className="text-white/50 font-[Saira]">{reserve}</div>
			</div>
		</div>
	)
}
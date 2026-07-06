import { useEffect, useState } from "react"
import { DEV } from ".."

const triggerCallback = (callback: string, data: Record<string, any>) => fetch(`https://${(window as any).GetParentResourceName()}/${callback}`, {
	method: 'post',
	headers: {
		'Content-Type': 'application/json; charset=UTF-8',
	},
	body: JSON.stringify(data)
})

export default () => {
	const [display, setDisplay] = useState(DEV)
	const [frequency, setFreq] = useState<string>('')

	useEffect(() => {
		const handler = (event: MessageEvent) => {
			const { key, value }: {
				key: 'radio:display'
				value: boolean
			} = event.data
			key === 'radio:display' && setDisplay(value)
		}
		
		window.addEventListener('message', handler)
		return () => window.removeEventListener('message', handler)
	}, [])

	window.addEventListener('keydown', (event: KeyboardEvent) => {
		if (event.key !== 'Escape') return
		
		setDisplay(false)
		triggerCallback('radio:close', {})
	})

	return (
		<div className={`w-full flex items-end h-full justify-end py-10 opacity-${display ? '100' : '0'}`}>
			<div className="relative inline-block">
			<input 
				className="absolute top-45/100 left-1/2 -translate-x-1/2 max-w-31/100 h-15 text-2xl outline-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
				type="number" 
				name="freq" 
				id="freq"
				title="Channel Frequency" 
				placeholder="0"
				value={frequency}
				onChange={event => setFreq(event.currentTarget.value)}
				onKeyDown={event => {
					if (event.key !== 'Enter') return

					triggerCallback('radio:frequency', { frequency })
				}}
			/>
				<button
					className="absolute top-80/100 left-38/100 -translate-x-1/2 cursor-pointer hover:bg-black/20 w-8 h-5"
					title="Leave the frequency"
					onClick={() => {
						triggerCallback('radio:leave', {})
						setFreq('')
					}}
				/>
				<img className={`max-h-150 ${DEV && 'border border-white'}`} src="radio.png" />
			</div>
		</div>
	)
}
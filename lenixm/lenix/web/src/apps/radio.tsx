import { focus, onEvent, triggerNui } from 'lenix/nui'
import { useEffect, useState } from 'react'
import type { Events, Requests } from 'types'

export const Radio = () => {
	const [display, setDisplay] = useState<boolean>()
	const [frequency, setFreq] = useState<string>('')

	useEffect(() => {
		const escHandler = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return

			setDisplay(false)
			focus()
			triggerNui<Requests['closeRadio']>('radio:close')
		}

		const dispose = onEvent<Events['displayRadio']>('radio:display', state => {
			setDisplay(state)
			focus(state, state)
		})

		window.addEventListener('keydown', escHandler)
		return () => {
			window.removeEventListener('keydown', escHandler)
			dispose()
		}
	}, [])

	return (
		<div
			inert={!display}
			className={`w-full flex items-end h-full justify-end py-10 ${display ? 'opacity-100' : 'opacity-0'}`}
		>
			<div className='relative inline-block'>
				<input
					className='absolute top-45/100 left-1/2 -translate-x-1/2 max-w-31/100 h-15 text-2xl outline-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
					type='number'
					name='freq'
					id='freq'
					title='Channel Frequency'
					placeholder='0'
					value={frequency}
					onChange={event => setFreq(event.currentTarget.value)}
					onKeyDown={event => {
						if (event.key !== 'Enter') return

						triggerNui<Requests['changeFrequency']>('radio:frequency', { frequency })
					}}
				/>
				<button
					className='absolute top-80/100 left-38/100 -translate-x-1/2 cursor-pointer hover:bg-black/20 w-8 h-5'
					title='Leave the frequency'
					onClick={() => {
						triggerNui<Requests['leaveRadio']>('radio:leave')
						setFreq('')
					}}
				/>
				<img className='max-h-150' src='radio.png' />
			</div>
		</div>
	)
}

import { DEV } from '@/App'
import { onNuiEmit } from 'lenix/nui'
import { useEffect, useState } from 'react'
import type { Events } from 'types'

interface Clip {
	clip: string
}

interface Reserve {
	reserve: string
}

interface UpdateValue extends Clip, Reserve {}

export const Hud = () => {
	const [state, setState] = useState<UpdateValue>({
		clip: '-',
		reserve: '-',
	})
	const [display, setDisplay] = useState<boolean>(DEV)

	useEffect(() => {
		const disposes = [
			onNuiEmit<Events['displayHud']>('hud:display', setDisplay),
			onNuiEmit<Events['updateHudClip']>('hud:update:clip', clip =>
				setState(prev => ({ clip, reserve: prev.reserve })),
			),
			onNuiEmit<Events['updateHudReserve']>('hud:update:reserve', reserve =>
				setState(prev => ({ reserve, clip: prev.clip })),
			),
		]
		return () => disposes.forEach(dispose => dispose())
	}, [])

	return (
		<div className={`absolute w-full flex justify-end p-5 ${display ? 'opacity-100' : 'opacity-0'}`}>
			<div className='flex gap-1 items-end'>
				<div className='font-number text-3xl'>{state.clip}</div>
				<div className='font-number text-xl font-thin italic'>{state.reserve}</div>
			</div>
		</div>
	)
}

import { Request } from '../shared/types.ts'
import { fetchNui } from './fetch.ts'

/**
 * Requests keyboard and cursor focus for the NUI browser.
 */
export const focus = (exclude?: 'keyboard' | 'cursor'): Promise<true> => {
	return fetchNui<Request<true, '__nuiFocus', {
		keyboard: boolean,
		cursor: boolean
	}>>('__nuiFocus', { keyboard: exclude === 'keyboard' ? false : true, cursor: exclude === 'cursor' ? false : true })
}

export const unFocus = (
	key: KeyboardEvent['key'],
	onEvent: () => void
) => {
	
	const handler = (e: KeyboardEvent) => {
	 if (e.key !== key) return

	 onEvent()
	}
	
	window.addEventListener('keydown', handler)
	return () => window.removeEventListener('keydown', handler)
}
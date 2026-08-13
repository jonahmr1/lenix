import { Request } from '../shared/types.ts'
import { fetchNui } from './fetch.ts'

/**
 * Sets the keyboard and cursor focus state for the NUI browser.
 */
export const setFocus = (
	keyboard: boolean,
	cursor: boolean
) => fetchNui<Request<true, '__nuiFocus', {
	keyboard: boolean,
	cursor: boolean
}>>('__nuiFocus', { keyboard, cursor })

export const focus = () => setFocus(true, true);
export const unFocus = () => setFocus(false, false);
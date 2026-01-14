import { Suggestion } from '../../../shared/types/freeroam'

export let DOMLoaded = false
export const earlySuggestionsInsertion: Suggestion[] = []

export const setDOMLoaded = (state: boolean) => DOMLoaded = state
export const isIterable = (obj: any) => obj != null && typeof obj[Symbol.iterator] === 'function'
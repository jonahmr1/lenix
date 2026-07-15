import type { Event } from '../types/index.ts'

const cbs = new Map<string, (...params: unknown[]) => void>()

// TODO: remove the event
const handler = window.addEventListener('message', (event: MessageEvent) => {
	const { id, params } = event.data
	const cb = cbs.get(id)
	if (!cb) throw new Error(`Callback<${id}> does not exist yet`)

	try {
		cb(...(params ?? []))
	} catch (e) {
		throw new Error(`Error occured while receiving event<${id}>. \n${e}`)
	}
})

export const onEvent = <
	T extends Event<string, unknown[]>
>(
	id: T[0],
	cb: (...params: T[1]) => void
): void => {
	cbs.set(id, cb)
}
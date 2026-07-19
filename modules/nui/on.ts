import type { Event } from '../shared/types.ts'

const events = new Map<string, Set<(...params: unknown[]) => void>>()

// deno-lint-ignore no-window no-window-prefix no-unused-vars
const handler = (event: MessageEvent) => {
	const { id, params } = event.data
	const callbacks = events.get(id)
	if (!callbacks) return console.error(`Event<${id}> does not exist yet`)

	try {
		callbacks.forEach(callback => callback(...(params ?? [])))
	} catch (e) {
		throw new Error(`Error occured while receiving event<${id}>. \n${e}`)
	}
}

/**
 * Registers a typed browser-side handler for events sent from the game client.
 */
export const onEvent = <
	T extends Event<string, unknown[]>
>(
	id: T[0],
	cb: (...params: T[1]) => void
): () => void => {
	if (events.size === 0) window.addEventListener('message', handler)

	const callbacks = events.get(id) ?? new Set<(...params: T[1]) => void>()
	callbacks.add(cb)
	events.set(id, callbacks)

	return () => {
		callbacks.delete(cb)
		if (callbacks.size === 0) events.delete(id)
		if (events.size === 0) {
			window.removeEventListener('message', handler)
		}
	}
}
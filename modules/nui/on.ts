import type { Event } from '../shared/types.ts'

type Listener<T extends unknown[]> = {
	callback: (...params: T) => void
	log?: boolean
}
const events = new Map<string, Set<Listener<unknown[]>>>()

// deno-lint-ignore no-window no-window-prefix no-unused-vars
const handler = (event: MessageEvent) => {
	const { id, params } = event.data
	const callbacks = events.get(id)
	if (!callbacks) return

	for (const { callback, log } of callbacks) {
		try {
			callback(...(params ?? []))
			log && console.info(`Callback from event<${id}> was called`)
		} catch (e) {
			console.error(`Error occured while receiving event<${id}>. \n${e}`)
		}
	}
}

/**
 * Registers a typed browser-side handler for events sent from the game client.
 */
export const onEvent = <
	T extends Event<string, unknown[]>
>(
	id: T[0],
	cb: (...params: T[1]) => void,
	listen?: boolean
): () => void => {
	if (events.size === 0) {
		window.addEventListener('message', handler)
		listen && console.info(`Event<${id}> is the first on the window`)
	}

	const callbacks = events.get(id) ?? new Set<Listener<unknown[]>>()
	const listenerCb = { callback: cb, log: listen }
	callbacks.add(listenerCb)
	events.set(id, callbacks)
	listen && console.info(`Event<${id}> was registered`)

	return () => {
		listen && console.info(`Event<${id}> was unregistered`)
		callbacks.delete(listenerCb)
		if (callbacks.size === 0) {
			events.delete(id)
			listen && console.info(`Event<${id}> got no callbacks left, memory cleared successfully`)
		}
		if (events.size === 0) {
			window.removeEventListener('message', handler)
			listen && console.info(`No events left, this event<${id}> was the last, opting out the listen...`)
		}
	}
}

import type { Event } from '../shared/types.ts'

interface Logger<T extends unknown[]> {
	callback: (...params: T) => void
	log?: true
}
const events = new Map<string, Set<Logger<unknown[]>>>()

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
export const onNuiEmit = <
	T extends Event<string, unknown[]>
>(
	id: T[0],
	cb: (...params: T[1]) => void,
	log?: true
): () => void => {
	if (events.size === 0) {
		window.addEventListener('message', handler)
		log && console.info(`Event<${id}> is the first on the window`)
	}

	const callbacks = events.get(id) ?? new Set<Logger<unknown[]>>()
	const listenerCb = { callback: cb, log: log }
	callbacks.add(listenerCb)
	events.set(id, callbacks)
	log && console.info(`Event<${id}> was registered`)

	return () => {
		log && console.info(`Event<${id}> was unregistered`)
		callbacks.delete(listenerCb)
		if (callbacks.size === 0) {
			events.delete(id)
			log && console.info(`Event<${id}> got no callbacks left, memory cleared successfully`)
		}
		if (events.size === 0) {
			window.removeEventListener('message', handler)
			log && console.info(`No events left, this event<${id}> was the last, opting out the listen...`)
		}
	}
}

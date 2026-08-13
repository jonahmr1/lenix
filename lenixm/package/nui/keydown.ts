const keyHandlers = new Map<string, Set<() => void>>()

window.addEventListener("keydown", (event) => {
	keyHandlers.get(event.key)?.forEach((handler) => handler())
})

export const onKeyDown = (
	key: KeyboardEvent["key"],
	handler: () => void
) => {
	const handlers = keyHandlers.get(key) ?? new Set()
	handlers.add(handler)
	keyHandlers.set(key, handlers)

	return () => {
		handlers.delete(handler)

		if (handlers.size === 0) {
			keyHandlers.delete(key)
		}
	}
}
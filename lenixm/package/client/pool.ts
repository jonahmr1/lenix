const tasks = new Set<() => void>()
let running = false

/**
 * Adds a task to a shared FiveM tick pool.
 */
export const pool = (cb: () => void): () => boolean => {
	const cleanUp = () => tasks.delete(cb)
	tasks.add(cb)

	if (running) return cleanUp
	
	running = true

	const tick = setTick(() => {
		if (!tasks.size) {
			clearTick(tick)
			running = false
			return
		}
		for (const task of tasks) {
			try {
				task()
			} catch (e) {
				tasks.delete(task)
				console.warn(e)
			}
		}
	})

	return cleanUp
}

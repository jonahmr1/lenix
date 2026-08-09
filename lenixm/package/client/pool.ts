const tasks = new Set<() => void>()
let running = false

/**
 * Adds a task to a shared FiveM tick pool.
 */
export const pool = (func: () => void): void => {
	tasks.add(func)

	if (running) return
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
}

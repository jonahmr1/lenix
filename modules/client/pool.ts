// deno-lint-ignore-file no-undef
const tasks = new Set<() => void>()
let running = false

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
				// deno-lint-ignore no-console
				console.warn(e)
			}
		}
	})
}

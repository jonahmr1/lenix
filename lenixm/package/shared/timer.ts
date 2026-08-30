/**
 * Starts a client timer using FiveM game time.
 */
export const timer = ({
	duration,
	updateInterval,
	onInterval,
	onEnd
}: {
	duration: number,
	updateInterval?: number,
	onInterval: (timeLeft: number) => void,
	onEnd?: () => void
}): () => void => {
	const start = GetGameTimer()

	const interval = setInterval(() => {
		const elapsed = GetGameTimer() - start
		const timeLeft = duration - elapsed

		if (elapsed >= duration) {
			clearInterval(interval)
			try {
				onEnd?.()
			} catch(e) {
				throw e
			}
			return
		}

		try {
			onInterval(timeLeft)
		} catch(e) {
			throw e
		}
	}, updateInterval)

	return () => clearInterval(interval)
}

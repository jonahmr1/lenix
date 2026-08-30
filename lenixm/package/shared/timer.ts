/**
 * Starts a client timer using FiveM game time.
 */
export const timer = ({
	duration,
	updateInterval,
	onTick,
	onEnd
}: {
	duration: number,
	updateInterval: number,
	onTick: (timeLeft: number) => void,
	onEnd: () => void
}): () => void => {
	const start = GetGameTimer()

	const interval = setInterval(() => {
		const elapsed = GetGameTimer() - start
		const timeLeft = duration - elapsed

		if (elapsed >= duration) {
			clearInterval(interval)
			onEnd()
			return
		}

		onTick(timeLeft)
	}, updateInterval)

	return () => clearInterval(interval)
}

/**
 * Delay execution for a given duration.
 * @param ms - Duration in milliseconds (1000ms = 1 second)
 */
export const wait = async (ms: number): Promise<void> => {
	await new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}

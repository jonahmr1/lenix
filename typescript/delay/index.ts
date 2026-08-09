/**
 * @module
 *
 * Time utilities.
 */

/**
 * Delays execution for a given duration.
 *
 * @param ms - Duration in milliseconds (1000ms = 1 second)
 *
 * @example
 * ```ts
 * import { delay } from '@lenix/lenix'
 *
 * await delay(1000)
 * ```
 */
export const delay = async (ms: number): Promise<void> =>
	await new Promise((resolve) => {
		setTimeout(resolve, ms)
	})

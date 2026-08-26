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
 * import { waste } from '@lenix/lenix'
 *
 * await waste(1000)
 * ```
 */
export const waste = async (ms: number): Promise<void> =>
	await new Promise((resolve) => {
		setTimeout(resolve, ms)
	})

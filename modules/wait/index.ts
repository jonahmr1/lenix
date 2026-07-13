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
 * import { wait } from '@lenix/lenix'
 *
 * await wait(1000)
 * ```
 */
export const wait = async (ms: number): Promise<void> => {
	await new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}

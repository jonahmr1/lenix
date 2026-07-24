/**
 * @module
 *
 * Object utilities.
 */

/**
 * Gets typed entries from an object.
 *
 * @param object - Object to get entries from.
 * @returns Typed object entries.
 *
 * @example
 * ```ts
 * import { entries } from '@lenix/lenix'
 *
 * const value = entries({ name: 'lenix', version: 1 })
 * ```
 */
export const entries = <T extends Record<string, unknown>>(
	object: T
): {
	[K in keyof T]: [K, T[K]]
}[keyof T][] =>
	Object.entries(object) as {
		[K in keyof T]: [K, T[K]]
	}[keyof T][]

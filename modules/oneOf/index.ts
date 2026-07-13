/**
 * @module
 *
 * Type guard utilities.
 */

/**
 * Checks whether a value is included in a readonly list.
 *
 * @param value - Value to check.
 * @param from - Values to check against.
 * @returns Whether the value is one of the provided values.
 *
 * @example
 * ```ts
 * import { oneOf } from '@lenix/lenix'
 *
 * const status: string = 'active'
 *
 * if (oneOf(status, ['active', 'idle'] as const)) {
 * 	status
 * }
 * ```
 */
export const oneOf = <T>(value: unknown, from: readonly T[]): value is T =>
	(from as readonly unknown[]).includes(value)

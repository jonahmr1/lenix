/**
 * @module
 *
 * Error utilities.
 */

/**
 * Throws an error from an expression context.
 *
 * @param error - The error to throw, can be a source of the error.
 * @param cause - The cause of the error.
 * @returns This function never returns.
 *
 * @example
 * ```ts
 * import { raise } from '@lenix/lenix'
 *
 * const value = maybeValue ?? raise('Expected a value')
 * ```
 */
export const raise = (error: unknown, cause?: unknown): never => {
	throw new Error(String(error), { cause })
}

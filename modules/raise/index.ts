/**
 * Throws an error.
 * @param error - The error to throw, can be a source of the error.
 * @param cause - The cause of the error.
 * @returns never, will crash the runtime.
 * @example
 * foo().catch(raise)
 */
export const raise = (error: unknown, cause?: unknown): never => {
	throw new Error(String(error), { cause })
}

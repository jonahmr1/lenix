/**
 * Get typed entries from an object (Typed Object.entries)
 * @param object - Object to get entries from
 * @returns Array of the passed entries
 */
export const entries = <T extends Record<string, unknown>>(
	object: T,
): {
	[K in keyof T]: [K, T[K]]
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
}[keyof T][] =>
	Object.entries(object) as {
		[K in keyof T]: [K, T[K]]
	}[keyof T][]

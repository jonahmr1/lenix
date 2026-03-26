/**
 * Get typed entries from an object (Typed Object.entries)
 * @param object - Object to get entries from
 * @returns Array of the passed entries
 */
export const entries = <T extends Record<string, unknown>>(
	object: T,
): {
	[K in keyof T]: [K, T[K]]
}[keyof T][] => {
	return Object.entries(object) as {
		[K in keyof T]: [K, T[K]]
	}[keyof T][]
}

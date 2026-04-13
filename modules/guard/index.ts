/**
 * Checks if the value is one of the values in the array
 * @param value - The value to check
 * @param from - The array of values to check from
 * @returns boolean, True if the value is one of the values in the array, False otherwise
 * @example
 * guard(1, [1, 2, 3]): true
 * guard(4, [1, 2, 3]): false
 */
export const guard = <T>(value: unknown, from: readonly T[]): value is T =>
	(from as readonly unknown[]).includes(value)

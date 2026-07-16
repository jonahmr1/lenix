/**
 * Asserts that a condition is true and narrows its type.
 */
export const asserts = <T extends boolean>(
	condition: T,
	errorMessage = 'assertion did not passed successfuly'
): asserts condition => {
	if (condition) return

	throw new Error(errorMessage)
}

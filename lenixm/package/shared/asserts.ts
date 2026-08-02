/**
 * Asserts that a condition is true and narrows its type.
 */
export function asserts(
	condition: unknown,
	errorMessage = `assertion did not passed successfuly, got ${condition}`,
): asserts condition {
	if (!condition) throw errorMessage
}

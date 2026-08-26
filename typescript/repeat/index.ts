export function repeat<T>(check: () => T): Promise<T>
export function repeat<T, C extends T>(
	check: () => T,
	untilOrEqual: C | ((checked: T) => checked is C),
	each?: number,
): Promise<C>
export function repeat<T>(
	check: () => T,
	untilOrEqual?: T | ((checked: T) => boolean),
	each?: number,
): Promise<T> {
	const hasCondition = arguments.length > 1
	const predicate = typeof untilOrEqual === 'function'
		? untilOrEqual as (checked: T) => boolean
		: undefined

	return new Promise(resolve => {
		const interval = setInterval(() => {
			const checked = check()

			const met = predicate
				? predicate(checked)
				: hasCondition
					? checked === untilOrEqual
					: checked !== undefined && checked !== null

			if (!met) return
			
			clearInterval(interval)
			resolve(checked)
		}, each)
	})
}

/*  */
export function repeat<T>(
	until: () => T,
): Promise<T>
export function repeat<T, const C extends T>(
	until: () => T,
	equal: C,
	each?: number,
): Promise<C>
export function repeat <T>(
	until: () => T,
	equal?: T,
	each?: number
): Promise<T> {
	return new Promise(resolve => {
		const interval = setInterval(() => {
			const result = until()

			if (equal === undefined) {
				if (result === undefined || result === null) return
				resolve(result)
				clearInterval(interval)
				return
			}

			if (!result !== equal) return

			resolve(equal ?? result)
			clearInterval(interval)
		}, each)
	})
}
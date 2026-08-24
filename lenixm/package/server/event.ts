export const onNetEvent = <
	Event extends string,
	Params extends unknown[]
>(event: Event, cb: (source: number, ...params: Params) => void) => {
	const handler = (...params: Params) => cb(source, ...params)
	addNetEventListener(event, handler)
	return () => removeEventListener(event, handler)
}

export const onEvent = <
	Event extends string,
	Params extends unknown[]
>(event: Event, cb: (...params: Params) => void) => {
	addEventListener(event, cb, false)
	return () => removeEventListener(event, cb)
}
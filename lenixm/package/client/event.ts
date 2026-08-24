export const onNetEvent = <
	Event extends string,
	Params extends unknown[]
>(event: Event, cb: (...params: Params) => void) => {
	addNetEventListener(event, cb)
	return () => removeEventListener(event, cb)
}

export const onEvent = <
	Event extends string,
	Params extends unknown[]
>(event: Event, cb: (...params: Params) => void) => {
	addEventListener(event, cb)
	return () => removeEventListener(event, cb)
}
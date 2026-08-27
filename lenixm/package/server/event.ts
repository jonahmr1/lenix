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

export const emitNetEvent = <Event extends string, Params extends unknown[]>(event: Event, source: number, ...params: Params) => emitNet(event, source, params)

export const emitEvent = <Event extends string, Params extends unknown[]>(event: Event, ...params: Params) => emit(event, params)
import { JsonValue } from "@lenix/lenix"

export const onNetEvent = <
	T extends [string, JsonValue[]]
>(event: T[0], cb: (source: number, ...params: T[1]) => void) => {
	const handler = (...params: T[1]) => cb(source, ...params)
	addNetEventListener(event, handler)
	return () => removeEventListener(event, handler)
}

export const onEvent = <
	T extends [string, JsonValue[]]
>(event: T[0], cb: (...params: T[1]) => void) => {
	addEventListener(event, cb, false)
	return () => removeEventListener(event, cb)
}

export const emitNetEvent = <
	T extends [string, JsonValue[]]
>(event: T[0], source: number, ...params: T[1]) => emitNet(event, source, params)

export const emitEvent = <
	T extends [string, JsonValue[]]
>(event: T[0], ...params: T[1]) => emit(event, params)
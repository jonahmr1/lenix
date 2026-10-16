import { JsonValue } from "@lenix/lenix"

export const onNetEvent = <
	T extends [string, JsonValue[]]
>(event: T[0], cb: (...params: T[1]) => void) => {
	addNetEventListener(event, cb)
	return () => removeEventListener(event, cb)
}

export const onEvent = <
	T extends [string, JsonValue[]]
>(event: T[0], cb: (...params: T[1]) => void) => {
	addEventListener(event, cb)
	return () => removeEventListener(event, cb)
}

export const emitNetEvent = <
	T extends [string, JsonValue[]]
>(event: T[0], ...params: T[1]) => emitNet(event, params)

export const emitEvent = <
	T extends [string, JsonValue[]]
>(event: T[0], ...params: T[1]) => emit(event, params)
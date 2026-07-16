// deno-lint-ignore-file no-undef
import type { Request } from '../types/index.ts'

/**
 * Sends an event from the game client to the NUI browser.
 */
export const emitEvent = <T extends [string, unknown[]]>(id: T[0], ...params: T[1]): void => {
	if (
		!SendNuiMessage(
			JSON.stringify({
				id,
				params: [...params]
			})
		)
	) {
		throw new Error('SendNuiMessage returned falsy')
	}
}

/**
 * Registers a typed NUI callback on the game client.
 */
export const onNui = <T extends Request<unknown, string, object>>(
	id: T[1],
	cb: (data: T[2]) => T[0]
): void => {
	RegisterNuiCallback(id, (data: T[2], reply: (_: unknown) => void) => reply(cb(data)))
}

import { JsonValue } from '@lenix/lenix'
import type { Request } from '../shared/types.ts'

/**
 * Sends an event from the game client to the NUI browser.
 */
export const emitNui = <T extends [string, unknown[]]>(id: T[0], ...params: T[1]): void => {
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
export const onNui = <T extends Request<JsonValue, string, object>>(
	id: T[1],
	cb: (data: T[2]) => T[0] | Promise<T[0]>
): void => {
	RegisterNuiCallback(id, async (
		data: T[2],
		reply: (_: unknown) => void
	) => {
		try {
			reply(await cb(data))
		} catch(e) {
			throw e
		}
	})
}

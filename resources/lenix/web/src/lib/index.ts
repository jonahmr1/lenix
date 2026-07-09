import type { Event, Request } from 'types'

const cbs = new Map<string, (...params: unknown[]) => void>()

// TODO: remove the event
const handler = window.addEventListener('message', (event: MessageEvent) => {
	const { id, params } = event.data
	const cb = cbs.get(id)
	if (!cb) throw new Error(`Callback<${id}> does not exist yet`)

	try {
		cb(...(params ?? []))
	} catch (e) {
		throw new Error(`Error occured while receiving event<${id}>. \n${e}`)
	}
})

export const onEvent = <T extends Event<string, unknown[]>>(id: T[0], cb: (...params: T[1]) => void) => cbs.set(id, cb)

export const triggetNui = async <T extends Request<unknown, string, object>>(id: T[1], data?: T[2]): Promise<T[0]> => {
	try {
		const response = await fetch(`https://${window.GetParentResourceName()}/${id}`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify(data ?? {}),
		})
		return await response.json()
	} catch (e) {
		throw new Error(`Error occured while emiting an nui<${id}>. \n${e}`)
	}
}

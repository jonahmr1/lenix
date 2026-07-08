import type { Event } from 'types'

const cbs = new Map<string, (...params: unknown[]) => void>()

// TODO: remove the event
const handler = window.addEventListener('message', (event: MessageEvent) => {
	const { id, params } = event.data
	const cb = cbs.get(id)
	if (!cb) throw new Error(`Callback<${id}> was does not exist yet`)

	try {
		cb(...(params ?? []))
	} catch (e) {
		throw new Error(`Error occured while receiving callback<${id}>. \n${e}`)
	}
})

export const onEvent = <T extends Event<string, any[]>>(id: T[0], cb: (...params: T[1]) => void) => cbs.set(id, cb)

export const triggetNui = async <T = unknown>(id: string, data?: object): Promise<T> => {
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
		throw new Error(`Error occured while emiting a callback<${id}>. \n${e}`)
	}
}

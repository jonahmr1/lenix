export const emitCb = async <T = unknown>(id: string, data?: object): Promise<T> => {
	try {
		const response = await fetch(`https://${(window as any).GetParentResourceName()}/${id}`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify(data ?? {})
		})
		return await response.json()
	} catch(e) {
		throw new Error(`Error occured while emiting a callback<${id}>. \n${e}`)
	}
}

const cbs = new Map<string, (...params: unknown[]) => void>()

window.addEventListener('message', (event: MessageEvent) => {
	const { id, params } = event.data
	const cb = cbs.get(id)
	if (!cb) throw new Error(`Callback<${id}> was does not exist yet`)
	
	try {
		cb(...(params ?? []))
	} catch(e) {
		throw new Error(`Error occured while receiving callback<${id}>. \n${e}`)
	}
})

export const onCb = (id: string, cb: (...params: unknown[]) => void) => {
	cbs.set(id, cb)
}
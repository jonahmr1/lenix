import type { NuiFetchGeneric, Request } from '../shared/types.ts'

declare function GetParentResourceName(): string

/**
 * Fetchs a typed request from the NUI browser to the game client.
 */
export const fetchNui = async <T extends NuiFetchGeneric>(
	id: T[1],
	data: T[2]
): Promise<T[0]> => {
	try {
		const response = await fetch(`https://${GetParentResourceName()}/${id}`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify(data)
		})
		return await response.json()
	} catch (e) {
		throw `Error occured while emiting an nui<${id}>.\n${e}`
	}
}

export const fetchNuiServer = <T extends NuiFetchGeneric>(
	id: T[1],
	requestData: T[2],
	timeout?: number,
): Promise<T[0]> => fetchNui<Request<T[0], '__nuiServer', {
	id: T[1]
	data: {
		timeout?: number
		requestData: T[2]
	}
}>>(
	'__nuiServer', {
	id,
	data: {
		timeout,
		requestData,
	}
})

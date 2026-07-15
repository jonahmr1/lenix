import type { Request } from '../types/index.ts'

export const triggerNui = async <T extends Request<unknown, string, object>>(id: T[1], data?: T[2]): Promise<T[0]> => {
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
		throw new Error(`Error occured while emiting an nui<${id}>.\n${e}`)
	}
}
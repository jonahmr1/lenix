import { asserts } from "@lenix/lenix"

interface Api {
	[resource: number]: never
	[resource: string]: {
		[method: number]: never
		[method: string]: <Return, Args extends unknown[] = []>(...args: Args) => Return
	}
}

export const api: Api = new Proxy(globalThis.exports, {
	get(target, resource: string) {
		const value = target[resource]
		
		asserts(
			GetResourceState(resource) === 'started' && value,
			`<${resource}> is not started yet to be invoked`
		)

		return new Proxy(value, {
			get(target, method: string) {
				const value = target[method]

				asserts(
					value,
					`Could not find <${method}> export in ${resource}`
				)

				return value
			},
		})
	},
}) as unknown as Api

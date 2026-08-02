import type { ClientScript, ServerScript } from 'types/dirs'

const EnabledContextedScripts = ['topscore'] as const satisfies readonly (ClientScript & ServerScript)[]

export const EnabledOnlyClientScripts = [] as const satisfies readonly Exclude<ClientScript, ServerScript>[]
export const EnabledOnlyServerScripts = [] as const satisfies readonly Exclude<ServerScript, ClientScript>[]

export const EnabledClientScripts = [
	...EnabledOnlyClientScripts,
	...EnabledContextedScripts,
] as const satisfies readonly ClientScript[]

export const EnabledServerScripts = [
	...EnabledOnlyServerScripts,
	...EnabledContextedScripts,
] as const satisfies readonly ServerScript[]
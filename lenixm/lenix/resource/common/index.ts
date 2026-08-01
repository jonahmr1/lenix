import { ResourceContext, ResourceName } from './resource'
import Config from './config'
import Locale from './locale'
import type { ClientScript, ServerScript } from 'types/dirs'

if (Config.PrintMessage) {
	const message = Locale(`starting.${ResourceContext}`, ResourceName)
	console.log(message)
}

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

import { ResourceContext, ResourceName } from './resource'
import Config from './config'
import Locale from './locale'
import type { ClientScript, ServerScript } from 'types/dirs'

if (Config.PrintMessage) {
	const message = Locale(`starting.${ResourceContext}`, ResourceName) as string
	console.log(message)
}

export const ContextedScripts = [
	'groups',
	'prison',
	'medical',
	'cuffs',
	'escort',
	'interactions',
	'hotel',
	'roster',
	'robbery',
] as const satisfies readonly (ClientScript & ServerScript)[]

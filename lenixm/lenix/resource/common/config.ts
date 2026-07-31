import Config from 'public/config.json'
import type { ClientScript, ServerScript } from 'types/dirs'

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

export default Config
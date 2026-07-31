import { LoadFile } from './utils'
import type { ClientScript, ServerScript } from 'types/dirs'

const Config = LoadFile('public/config.json')

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
] as const satisfies (ClientScript & ServerScript)[]
export const ClientScripts = [
	'crouch',
	'rent',
	'safezones',
	'crouch',
	'tick',
	'radialmenu',
	'identities',
	'weather',
	'hud',
	'radio',
	'elevators',
	'handsup',
	'settings',
] as const satisfies Exclude<ClientScript, ServerScript>[]
export const ServerScripts = ['appearance'] as const satisfies Exclude<ServerScript, ClientScript>[]

export default Config

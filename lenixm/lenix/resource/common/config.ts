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
] as const satisfies readonly Exclude<ClientScript, ServerScript>[]

export const ServerScripts = [
	'appearance',
	'db',
] as const satisfies readonly Exclude<ServerScript, ClientScript>[]

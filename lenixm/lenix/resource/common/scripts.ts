import type { ClientScript, ServerScript } from 'types/dirs'

const EnabledContextedScripts = [
	'cuffs',
	'escort',
	'groups',
	'hotel',
	'interactions',
	'medical',
	'prison',
	'robbery',
	// 'roster',
	// 'topscore',
	// 'criminaltask',
	// 'carmodes',
	// 'megaphone',
] as const satisfies readonly (ClientScript & ServerScript)[]

export const EnabledOnlyClientScripts = [
	'crouch',
	'elevators',
	'handsup',
	'hud',
	'identities',
	'radialmenu',
	'radio',
	'rent',
	'safezones',
	'settings',
	'weather',
	'snipets'
] as const satisfies readonly Exclude<ClientScript, ServerScript>[]
export const EnabledOnlyServerScripts = [
	'appearance',
	'db'
] as const satisfies readonly Exclude<ServerScript, ClientScript>[]

export const EnabledClientScripts = [
	...EnabledOnlyClientScripts,
	...EnabledContextedScripts,
] as const satisfies readonly ClientScript[]

export const EnabledServerScripts = [
	...EnabledOnlyServerScripts,
	...EnabledContextedScripts,
] as const satisfies readonly ServerScript[]
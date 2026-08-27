import type { ClientScript, ServerScript } from 'types/dirs'

const EnabledContextedScripts = [
	// 'groups',
	// 'hotel',
	'interaction',
	// 'medical',
	'prison',
	'robbery',
	'roster',
	'topscore',
	// 'criminaltask',
	// 'megaphone',
	'criminaltask',
] as const satisfies readonly (ClientScript & ServerScript)[]

export const EnabledOnlyClientScripts = [
	// 'elevators',
	'hud',
	'identities',
	'radialmenu',
	'radio',
	// 'rent',
	// 'safezones',
	// 'settings',
	// 'weather',
	'snipets',
	// 'carmodes',
	'megaphone',
	'charselect'
] as const satisfies readonly Exclude<ClientScript, ServerScript>[]
export const EnabledOnlyServerScripts = ['appearance', 'db'] as const satisfies readonly Exclude<
	ServerScript,
	ClientScript
>[]

export const EnabledClientScripts = [
	...EnabledOnlyClientScripts,
	...EnabledContextedScripts,
] as const satisfies readonly ClientScript[]

export const EnabledServerScripts = [
	...EnabledOnlyServerScripts,
	...EnabledContextedScripts,
] as const satisfies readonly ServerScript[]

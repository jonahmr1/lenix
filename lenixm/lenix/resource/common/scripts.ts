import type { ClientScript, ServerScript } from 'types/dirs'

const EnabledContextedScripts = [
	'group',
	'hotel',
	'interaction',
	'medical',
	'prison',
] as const satisfies readonly (ClientScript & ServerScript)[]

export const EnabledOnlyClientScripts = [
	'radio',
	'settings',
	'weather',
	'snipets',
	'megaphone',
	'charselect',
	'emotes'
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

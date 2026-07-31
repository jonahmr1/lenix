import { ContextedScripts } from 'common'
import type { ClientScript, ServerScript } from 'types/dirs'

const ClientScripts = [
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

for (const script of [...ClientScripts, ...ContextedScripts]) {
	import(script)
}
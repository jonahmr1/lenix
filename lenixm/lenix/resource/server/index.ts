import { ContextedScripts } from 'common'
import type { ClientScript, ServerScript } from 'types/dirs'

const ServerScripts = [
	'appearance',
	'db',
] as const satisfies readonly Exclude<ServerScript, ClientScript>[]

for (const script of [...ServerScripts, ...ContextedScripts]) {
	import(`./${script}`)
}
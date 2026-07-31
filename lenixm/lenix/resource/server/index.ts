import 'common'
import { ContextedScripts, ServerScripts } from 'common/config'

for (const script of [...ServerScripts, ...ContextedScripts]) {
	import(script)
}
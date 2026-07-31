import 'common'

import { ClientScripts, ContextedScripts } from 'common/config'

for (const script of [...ClientScripts, ...ContextedScripts]) {
	import(script)
}
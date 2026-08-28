import 'common'
import { EnabledServerScripts } from 'common/scripts'
import type { ServerScript } from 'types/dirs'

for (const script of EnabledServerScripts) {
	const modules = {
		appearance: () => import('./appearance'),
		db: () => import('./db'),

		group: () => import('./group'),
		hotel: () => import('./hotel'),
		interaction: () => import('./interaction'),
		medical: () => import('./medical'),
		prison: () => import('./prison'),
	} satisfies Record<ServerScript, () => Promise<unknown>>
	modules[script]()
}

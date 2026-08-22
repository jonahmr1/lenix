import 'common'
import { EnabledServerScripts } from 'common/scripts'
import type { ServerScript } from 'types/dirs'

for (const script of EnabledServerScripts) {
	const modules = {
		appearance: () => import('./appearance'),
		db: () => import('./db'),

		cuffs: () => import('./cuffs'),
		escort: () => import('./escort'),
		groups: () => import('./groups'),
		hotel: () => import('./hotel'),
		interactions: () => import('./interactions'),
		medical: () => import('./medical'),
		prison: () => import('./prison'),
		robbery: () => import('./robbery'),
		roster: () => import('./roster'),
		topscore: () => import('./topscore'),
		criminaltask: () => import('./criminaltask'),
	} satisfies Record<ServerScript, () => Promise<unknown>>
	modules[script]()
}

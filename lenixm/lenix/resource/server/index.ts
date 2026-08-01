import { EnabledServerScripts } from 'common'
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
	} satisfies Record<ServerScript, () => Promise<unknown>>
	modules[script]()
}

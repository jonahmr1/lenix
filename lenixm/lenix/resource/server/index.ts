import { EnabledContextedScripts } from 'common'
import type { ClientScript, ServerScript } from 'types/dirs'

const EnabledServerScripts = [] as const satisfies readonly Exclude<ServerScript, ClientScript>[]

for (const script of [...EnabledServerScripts, ...EnabledContextedScripts]) {
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
	} satisfies Record<ServerScript, () => Promise<unknown>>
	modules[script]()
}
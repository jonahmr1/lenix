import 'common'
import { EnabledClientScripts } from 'common/scripts'
import type { ClientScript } from 'types/dirs'

for (const script of EnabledClientScripts) {
	const modules = {
		radio: () => import('./radio'),
		settings: () => import('./settings'),
		weather: () => import('./weather'),

		group: () => import('./group'),
		hotel: () => import('./hotel'),
		interaction: () => import('./interaction'),
		medical: () => import('./medical'),
		prison: () => import('./prison'),
		snipets: () => import('./snipets'),
		megaphone: () => import('./megaphone'),
		charselect: () => import('./charselect'),
		emotes: () => import('./emotes'),
	} satisfies Record<ClientScript, () => Promise<unknown>>
	modules[script]()
}

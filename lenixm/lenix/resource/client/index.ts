import 'common'
import { EnabledClientScripts } from 'common/scripts'
import type { ClientScript } from 'types/dirs'

for (const script of EnabledClientScripts) {
	const modules = {
		elevators: () => import('./elevators'),
		radio: () => import('./radio'),
		rent: () => import('./rent'),
		safezones: () => import('./safezones'),
		settings: () => import('./settings'),
		weather: () => import('./weather'),

		group: () => import('./group'),
		hotel: () => import('./hotel'),
		interaction: () => import('./interaction'),
		medical: () => import('./medical'),
		prison: () => import('./prison'),
		robbery: () => import('./robbery'),
		roster: () => import('./roster'),
		topscore: () => import('./topscore'),
		criminaltask: () => import('./criminaltask'),
		snipets: () => import('./snipets'),
		megaphone: () => import('./megaphone'),
		charselect: () => import('./charselect'),
		emotes: () => import('./emotes'),
	} satisfies Record<ClientScript, () => Promise<unknown>>
	modules[script]()
}

import 'common'
import { EnabledClientScripts } from 'common/scripts'
import type { ClientScript } from 'types/dirs'

for (const script of EnabledClientScripts) {
	const modules = {
		crouch: () => import('./crouch'),
		elevators: () => import('./elevators'),
		handsup: () => import('./handsup'),
		hud: () => import('./hud'),
		identities: () => import('./identities'),
		radialmenu: () => import('./radialmenu'),
		radio: () => import('./radio'),
		rent: () => import('./rent'),
		safezones: () => import('./safezones'),
		settings: () => import('./settings'),
		weather: () => import('./weather'),

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
		criminalTask: () => import('./criminaltask'),
		snipets: () => import('./snipets'),
	} satisfies Record<ClientScript, () => Promise<unknown>>
	modules[script]()
}

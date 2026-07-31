import { EnabledContextedScripts } from 'common'
import type { ClientScript, ServerScript } from 'types/dirs'

const EnabledClientScripts = [] as const satisfies readonly Exclude<ClientScript, ServerScript>[]

for (const script of [...EnabledClientScripts, ...EnabledContextedScripts]) {
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
		tick: () => import('./tick'),
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
	} satisfies Record<ClientScript, () => Promise<unknown>>
	modules[script]()
}
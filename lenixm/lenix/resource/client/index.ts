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
	} satisfies Record<ClientScript, () => Promise<unknown>>
	modules[script]()
}

setTick(() => {
	SetParkedVehicleDensityMultiplierThisFrame(0.0)
	SetVehicleDensityMultiplierThisFrame(0.0)
	SetRandomVehicleDensityMultiplierThisFrame(0.0)
	SetPedDensityMultiplierThisFrame(0.0)
	SetScenarioPedDensityMultiplierThisFrame(0.0, 0.0)

	SetPedStealthMovement(PlayerPedId(), false, 'nil')

	// disable shuffle
	SetPedConfigFlag(PlayerPedId(), 184, true)

	DisplayAmmoThisFrame(false)
})

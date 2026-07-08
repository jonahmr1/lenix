import { cache, progressBar, skillCheck } from '@overextended/ox_lib/client'

setImmediate(() => {
	globalThis.exports.ox_target.addSphereZone({
		coords: [-324.9671, -588.6762, 32.7755, 46.672],
		options: {
			label: 'Check-in',
			onSelect: async () => {
				const done = await progressBar({
					label: 'Checking in...',
					duration: 5000,
					canCancel: true,
				})
				if (!done) return
				SetEntityCoordsNoOffset(cache.ped, -348.1212, -603.7713, 38.1888, false, false, false)
				SetEntityHeading(cache.ped, 208.3235)
				SetEntityHealth(cache.ped, GetEntityMaxHealth(cache.ped))
			},
		},
	})

	globalThis.exports.ox_target.addGlobalPlayer({
		label: 'Revive',
		canInteract: (entity: number) => {
			const source = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
			const player = Player(source)
			const isDead = player.state['isDead']
			const count = globalThis.exports.ox_inventory.Search('count', 'medkit')
			return isDead && count > 0
		},
		onSelect: async ({ entity }: { entity: number }) => {
			const res = await skillCheck(['easy', 'easy', 'medium', 'medium'], ['1', '2', '3', '4'])
			if (!res) return

			const source = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
			emitNet('lenix:server:medical:revive', source)
		},
	})
})

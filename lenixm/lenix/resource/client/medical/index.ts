import { cache, checkDependency, progressBar, skillCheck } from '@overextended/ox_lib/client'
import { api } from 'lenix/client'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('ox_target', '1.18.1', true)
checkDependency('ox_inventory', '2.47.9', true)

setImmediate(() => {
	api.ox_target?.addSphereZone?.({
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

	api.ox_target?.addGlobalPlayer?.({
		label: 'Revive',
		canInteract: (entity: number) => {
			const source = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
			const player = Player(source)
			const isDead = player.state['isDead']
			const count = api.ox_inventory?.GetItemCount?.<number, [unknown]>('medkit') ?? 0
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

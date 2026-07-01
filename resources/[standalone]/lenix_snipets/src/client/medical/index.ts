import { cache, progressBar } from "@overextended/ox_lib/client"

exports.ox_target.addSphereZone({
	coords: [-324.9671, -588.6762, 32.7755, 46.6720],
	options: {
		label: "Check-in",
		onSelect: async () => {
			const done = await progressBar({
				label: "Checking in...",
				duration: 5000,
				canCancel: true
			})
			if (!done) return
			SetEntityCoordsNoOffset(cache.ped, -348.1212, -603.7713, 38.1888, false, false, false)
			SetEntityHeading(cache.ped, 208.3235)
			SetEntityHealth(cache.ped, GetEntityMaxHealth(cache.ped));
		}
	}
})

import { Point, cache, hideTextUI, showTextUI } from '@overextended/ox_lib/client'
import type { Vector3 } from 'types'

const SAFE_ZONES: {
	coords: Vector3
	distance: number
}[] = [
	{
		coords: [-318.7234, -600.5191, 47.9801],
		distance: 100.0,
	},
	{
		coords: [14.3217, -1119.3396, 28.7839],
		distance: 20.0,
	},
	{
		coords: [34.9745, -605.4366, 31.6286],
		distance: 50.0,
	},
	{
		coords: [433.1338, -983.0835, 30.7097],
		distance: 50.0,
	},
	{
		coords: [41.5827, -1746.3785, 29.315],
		distance: 50.0,
	},
	{
		coords: [-316.6209, -1023.0312, 30.385],
		distance: 50.0,
	},
	{
		coords: [1697.5388, 2579.3191, 52.9961],
		distance: 200.0,
	},
]

SAFE_ZONES.map(({ coords, distance }) => {
	const blip = AddBlipForRadius(...coords, distance)
	SetBlipColour(blip, 2)
	SetBlipAlpha(blip, 32)

	const point = new Point({
		coords,
		distance,
		nearby: () => DisablePlayerFiring(cache.ped, true),
	})

	point.onEnter = () => {
		showTextUI('You are in the safe zone', {
			position: 'bottom-center',
			icon: 'circle-exclamation',
			iconColor: '#FF5100',
			style: {
				borderRadius: '1rem',
				backgroundColor: '#422A00',
			},
		})
	}

	point.onExit = () => {
		showTextUI('You are no longer in the safe zone', {
			position: 'bottom-center',
			icon: 'circle-check',
			iconColor: '#48FF00',
			style: {
				borderRadius: '1rem',
				backgroundColor: '#0A4200',
			},
		})
		setTimeout(() => {
			hideTextUI()
		}, 3000)
	}
})

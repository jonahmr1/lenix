import { checkDependency, inputDialog, onServerCallback, Point } from '@overextended/ox_lib/client'
import { INSIDE_COORDS } from 'common/config'

checkDependency('ox_lib', '3.39.0', true)

onServerCallback('lenix:imprisonPlayer', async () => {
	const input = await inputDialog(
		'Imprison a person',
		[
			{
				type: 'number',
				label: 'Player id',
			},
			{
				type: 'number',
				label: 'Period (in minutes)',
			},
		],
		{},
	)
	if (!input) return
	return {
		id: input[0],
		period: input[1],
	}
})

setImmediate(() => {
	const point = new Point({
		coords: INSIDE_COORDS,
		distance: 150,
	})

	point.onExit = () => emitNet('lenix:server:prison:teleport')
})

import { inputDialog, onServerCallback, Point } from '@overextended/ox_lib/client'
import { INSIDE } from 'common/prison'

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
		coords: INSIDE,
		distance: 150,
	})

	point.onExit = () => emitNet('lenix:server:prison:teleport')
})

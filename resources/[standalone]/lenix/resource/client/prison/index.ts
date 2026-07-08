import { inputDialog, onServerCallback, Point } from '@overextended/ox_lib/client'

onServerCallback('ox:imprisonPlayer', async () => {
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
		coords: [1697.5388, 2579.3191, 52.9961],
		distance: 150,
	})

	point.onExit = () => emitNet('ox:sendToPrison')
})

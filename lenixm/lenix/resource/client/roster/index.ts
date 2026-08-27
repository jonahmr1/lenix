import { cache, checkDependency, inputDialog, notify } from '@overextended/ox_lib/client'
import type { Events, Officers, PartialOfficer, Requests } from 'types/index'
import { GetPlayer } from '@overextended/ox_core/client'
import { control, emitNui, onNui } from 'lenix/client'
import { MAX_CALLSIGN_LENGTH } from 'common/config'
import { State } from '@lenix/lenix'

checkDependency('ox_lib', '3.39.0', true)

const state = new State({ display: false as boolean })

const changeCallsign = async () => {
	const input = await inputDialog(
		'Update Callsgin',
		[
			{
				type: 'input',
				label: 'Callsign',
			},
		],
	{})
	if (!input) return

	const callsign = input[0]?.toString()
	if (!callsign?.length) return

	if (callsign.length > MAX_CALLSIGN_LENGTH) {
		notify({
			title: 'Failed!',
			description: `Callsign can not be longer than ${MAX_CALLSIGN_LENGTH} characters`,
			type: 'error',
		})
		return
	}

	emitNet('lenix:server:roster:updateOfficer', {
		playerId: cache.serverId,
		callsign,
	} satisfies PartialOfficer)
}

onNui<Requests['updateOfficer']>('roster:updateOfficer', partialData => {
	emitNet('lenix:server:roster:updateOfficer', partialData)
	return null
})

onNui<Requests['triggerCallsign']>('roster:callsign', () => {
	changeCallsign()
	return null
})

onNet('lenix:client:roster:refreshOfficers', (officers: Officers) => {
	emitNui<Events['refreshOfficers']>('roster:refreshOfficers', officers)
})

on('lenix:client:roster:toggleDisplay', () => {
	const player = GetPlayer()
	if (typeof player.getGroup('police') !== 'number') return

	emitNui<Events['displayRoster']>('roster:display', state.display, cache.serverId)
	state.display = !state.display
})

control.on({
	event: 'press',
	key: 'U',
	onEvent: () => emit('lenix:client:roster:toggleDisplay')
})


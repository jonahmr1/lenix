import { addKeybind, cache, inputDialog, notify } from '@overextended/ox_lib/client'
import type { Events, Officers, PartialOfficer, Requests } from 'types/index'
import { GetPlayer } from '@overextended/ox_core/client'
import { emitEvent, onNui } from 'lenix/client'
import { MAX_CALLSIGN_LENGTH } from 'common/roster'

let visible: boolean = false
let group: string

const addOfficer = (groupName: string) => {
	const player = GetPlayer()
	if (!player) return

	const grade = player.getGroup('police')
	if (!grade) return

	group = groupName
	emitNet('lenix:server:roster:addOfficer', cache.serverId, player.charId)
}

const changeCallsign = async () => {
	const input = await inputDialog('Update Callsgin', [
		{
			type: 'input',
			label: 'Callsign',
		}
	], {})
	if (!input) return

	const callsign = input[0]?.toString()
	if (!callsign || callsign.length === 0) return

	if (callsign.length > MAX_CALLSIGN_LENGTH) {
		notify({
			title: 'Failed!',
			description: `Callsign can not be longer than ${MAX_CALLSIGN_LENGTH} characters`,
			type: 'error'
		})
		return
	}

	emitNet('lenix:server:roster:updateOfficer', {
		playerId: cache.serverId,
		callsign
	} satisfies PartialOfficer)
}

const toggleDisplay = () => {
	const newState = !visible
	if (!group || group !== 'police') return

	emitEvent<Events['displayRoster']>('roster:display', newState, cache.serverId)
	visible = newState
}

const nuiFocus = () => {
	if (!visible) return
	SetNuiFocus(true, true)
}

addKeybind({
	name: 'roster_focus',
	description: 'Turn On The Police Roster Cursor Focus',
	defaultKey: 'i',
	onPressed: nuiFocus
})

onNui<Requests['updateOfficer']>('roster:updateOfficer', (partialData) => {
	emitNet('lenix:server:roster:updateOfficer', partialData)
	return true
})

onNui<Requests['loseFocus']>('roster:lostFocus', () => {
	SetNuiFocus(false, false)
	return true
})

onNui<Requests['triggerCallsign']>('roster:callsign', () => {
	SetNuiFocus(false, false)
	changeCallsign()
	return true
})

onNet('lenix:client:roster:refreshOfficers', (officers: Officers) => {
	emitEvent<Events['refreshOfficers']>('roster:refreshOfficers', officers)
})

onNet('ox:setGroup', (groupName: string) => {
	//TODO: check when firing
	addOfficer(groupName)
});

on('lenix:client:roster:toggleDisplay', toggleDisplay)

on('onResourceStart', (resource: string) => {
	if (GetCurrentResourceName() !== resource) return

	addOfficer('police')
})
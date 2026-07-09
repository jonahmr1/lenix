import { addKeybind, cache } from '@overextended/ox_lib/client'
import type { Events, Officers, Requests } from 'types/index'
import { GetPlayer } from '@overextended/ox_core/client'
import { emitEvent, onNui } from '../_lib'

let visible: boolean = false
let group: string

addKeybind({
	name: 'roster',
	description: 'Toggle The Police Roster',
	defaultKey: 'j',
	onPressed: () => {
		const newState = !visible
		if (!group || group !== 'police') return
		emitEvent<Events['displayRoster']>('roster:display', newState, cache.serverId)
		visible = newState
	},
})

addKeybind({
	name: 'roster_focus',
	description: 'Turn On The Police Roster Cursor Focus',
	defaultKey: 'k',
	onPressed: () => {
		if (!visible) return
		SetNuiFocus(true, true)
	}
})

onNet('lenix:client:roster:refreshOfficers', (officers: Officers) => {
	emitEvent<Events['refreshOfficers']>('roster:refreshOfficers', officers)
})

onNui<Requests['updateOfficer']>('roster:updateOfficer', (partialData) => {
	console.debug(partialData)
	emitNet('lenix:server:roster:updateOfficer', partialData)
	return true
})

onNui<Requests['loseFocus']>('roster:lostFocus', () => {
	SetNuiFocus(false, false)
	return true
})

const addOfficer = (groupName: string) => {
	const player = GetPlayer()
	if (!player) return

	const grade = player.getGroup('police')
	if (!grade) return

	group = groupName
	emitNet('lenix:server:roster:addOfficer', cache.serverId, player.charId)
}

onNet('ox:setGroup', (groupName: string) => {
	//TODO: check when firing
	addOfficer(groupName)
});

on('onResourceStart', (resource: string) => {
	if (GetCurrentResourceName() !== resource) return

	addOfficer('police')
})
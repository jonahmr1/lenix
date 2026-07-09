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
		// if (!group || group !== 'police') return
		emitEvent<Events['displayRoster']>('roster:display', newState)
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

onNet('lenix:client:roster:updateOfficers', (officers: Officers) => {
	emitEvent<Events['updateOfficers']>('roster:updateOfficers', officers)
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

onNui<Requests['getPlayerId']>('roster:getPlayerId', () => cache.serverId)

const addOfficer = (groupName: string) => {
	const player = GetPlayer()
	if (!player.charId) return

	group = groupName
	emitNet('lenix:server:roster:addOfficer', player.charId)
}

onNet('ox:setGroup', (groupName: string) => {
	addOfficer(groupName)
});

on('ox:playerLoaded', () => {
	const grade = GetPlayer().getGroup('police')
	if (!grade) return

	group = 'police'
});

on('onResourceStart', (resource: string) => {
	if (GetCurrentResourceName() !== resource) return

	addOfficer('police')
})
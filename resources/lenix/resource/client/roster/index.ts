import { addKeybind } from '@overextended/ox_lib/client'
import type { Events, Officers, Requests } from 'types/index'
import { GetPlayer } from '@overextended/ox_core/client'
import { emitEvent, onNui } from '../_lib'

let visible: boolean = false
let group: string

addKeybind({
	name: 'roster',
	description: 'Toggle The Police Roster',
	defaultKey: 'K',
	onPressed: () => {
		if (!group || group !== 'police') return
		emitEvent<Events['displayRoster']>('roster:display', !visible)
		visible = !visible
	},
})

onNet('lenix:client:roster:updateOfficers', (officers: Officers) => {
	emitEvent<Events['updateOfficers']>('roster:updateOfficers', officers)
})

onNui<Requests['updateOfficer']>('roster:updateOfficer', (partialData) => {
	emitNet('lenix:server:roster:updateOfficer', partialData)
	return true
})

onNet('ox:setGroup', (groupName: string) => {
	const player = GetPlayer()
	if (!player.charId) return

	group = groupName
	emitNet('lenix:server:roster:addOfficer', player.charId)
});

on('ox:playerLoaded', () => {
	const grade = GetPlayer().getGroup('police')
	if (!grade) return

	group = 'police'
});
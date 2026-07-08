import { addKeybind } from '@overextended/ox_lib/client'
import { emitEvent, onNui } from '..'
import type { Events, Officers, Requests } from 'types/index'
import { GetPlayer } from '@overextended/ox_core/client'

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

onNet('lenix:client:roster:receiveOfficers', (officers: Officers) => {
	emitEvent<Events['updateOfficers']>('roster:updateOfficers', officers)
})

onNui<Requests['updateOfficer']>('roster:updateOfficer', (officer) => {
	emitNet('lenix:server:roster:updateOfficer', officer)
	return true
})

onNet('ox:setGroup', (groupName: string) => {
	group = groupName
});

on('ox:playerLoaded', () => {
  const grade = GetPlayer().getGroup('police')
	console.debug(grade)
});
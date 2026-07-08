import { addKeybind } from '@overextended/ox_lib/client'
import { emitEvent, onNui } from '..'
import type { Events, Officers, Requests } from 'types/index'

let visible: boolean = false

addKeybind({
	name: 'roster',
	description: 'Toggle The Police Roster',
	defaultKey: 'K',
	onPressed: () => {
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
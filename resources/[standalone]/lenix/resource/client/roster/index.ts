import { addKeybind } from '@overextended/ox_lib/client'
import { emitEvent } from '..'
import type { Events } from 'types/index'

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

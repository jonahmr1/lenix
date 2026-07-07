import { addKeybind } from "@overextended/ox_lib/client";

let visible: boolean = false

addKeybind({
	name: 'roster',
	description: 'Toggle The Police Roster',
	defaultKey: 'K',
	onPressed: () => {
		SendNuiMessage(JSON.stringify({
			key: 'roster:display',
			value: !visible
		}))
		visible = !visible
	}
})
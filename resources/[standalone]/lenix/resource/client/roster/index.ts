import { addKeybind } from "@overextended/ox_lib/client";
import { emitCb } from "..";
import type { Callbacks } from "types/index";

let visible: boolean = false

addKeybind({
	name: 'roster',
	description: 'Toggle The Police Roster',
	defaultKey: 'K',
	onPressed: () => {
		emitCb<Callbacks['displayRoster']>('roster:display', !visible)
		visible = !visible
	}
})
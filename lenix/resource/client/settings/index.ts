import { inputDialog } from "@overextended/ox_lib/client";
import { client } from "lenix/client";
import type { PlayerStorage } from "types/index";

const openSettings = async () => {
	const input = await inputDialog('Settings', [
		{
			type: 'checkbox',
			label: 'Supress inventory notifications',
			checked: client.player.storage.get<PlayerStorage, 'invNotifications'>('invNotifications')
		}
	], {})

	if (!input) return

	const supress = input[0]
	if (supress === undefined) throw new Error('Failed to update settings')

	emit('ox_inventory:suppressItemNotifications', supress)
	client.player.storage.set('lenix:supressInvNotify', supress.toString())
}

on('lenix:client:settings:open', openSettings)
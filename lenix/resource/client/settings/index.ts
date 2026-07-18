import { inputDialog } from "@overextended/ox_lib/client";
import { client } from "lenix/client";

const openSettings = async () => {
	const input = await inputDialog('Settings', [
		{
			type: 'checkbox',
			label: 'Supress inventory notifications',
		}
	], {})

	if (!input) return

	const supress = input[0]
	emit('ox_inventory:suppressItemNotifications', client.entity.handle(), supress)
}

on('lenix:client:settings:open', openSettings)
import { inputDialog } from "@overextended/ox_lib/client";
import { client } from "lenix/client";

type Settings = 'lenix:invNotifications'

const openSettings = async () => {
	const input = await inputDialog('Settings', [
		{
			type: 'checkbox',
			label: 'Supress inventory notifications',
			checked: client.player.storage.get<Settings>('lenix:invNotifications') === 'true' ? true : false
		}
	], {})

	if (!input) return

	const supress = input[0]
	if (supress === undefined) throw new Error('Failed to update settings')

	emit('ox_inventory:suppressItemNotifications', client.entity.handle(), supress)
	client.player.storage.set('lenix:supressInvNotify', supress.toString())
}

on('lenix:client:settings:open', openSettings)
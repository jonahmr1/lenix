import { checkDependency, inputDialog } from '@overextended/ox_lib/client'
import { player } from 'lenix/client'
import type { PlayerStorage } from 'types/index'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('ox_inventory', '2.47.9', true)

const openSettings = async () => {
	const input = await inputDialog(
		'Settings',
		[
			{
				type: 'checkbox',
				label: 'Supress inventory notifications',
				checked: player.storage.get<PlayerStorage, 'invNotifications'>('invNotifications'),
			},
		],
		{},
	)

	if (!input) return

	const supress = input[0] as boolean

	emit('ox_inventory:suppressItemNotifications', supress)
	player.storage.set<PlayerStorage>('invNotifications', supress)
}

on('lenix:client:settings:open', openSettings)

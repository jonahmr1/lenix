import { addRadialItem, notify, onCache, removeRadialItem } from '@overextended/ox_lib/client'

addRadialItem([
	{
		id: 'reload',
		label: 'Reload',
		icon: 'shirt',
		onSelect: () => emit('illenium-appearance:client:reloadSkin'),
	},
	{
		id: 'escort',
		label: 'Escort',
		icon: 'user-group',
		onSelect: () => emit('lenix:client:escort')
	},
	{
		id: 'put-in-vehicle',
		label: 'Put in vehicle',
		icon: 'arrow-right-to-bracket',
		onSelect: () => emit('lenix:client:interactions:in')
	},
	{
		id: 'take-out-vehicle',
		label: 'Take out of vehicle',
		icon: 'arrow-right-from-bracket',
		onSelect: () => emit('lenix:client:interactions:out')
	},
	{
		id: 'emote',
		label: 'Emotes',
		icon: 'person-walking',
		onSelect: () => notify({
			title: 'Not available yet!',
		})
	},
	{
		id: 'settings',
		label: 'Settings',
		icon: 'gear',
		onSelect: () => emit('lenix:client:settings:open')
	}
])

onCache('vehicle', vehicle => {
	if (vehicle)
		addRadialItem({
			id: 'vehicle-menu',
			label: 'Vehicle',
			icon: 'car',
			onSelect: () => emit('vehiclecontrol:toggle'),
		})
	else removeRadialItem('vehicle-menu')
})

onNet('ox:setGroup', (groupName: string, _grade: number) => {
	if (groupName === 'police')
		addRadialItem({
			id: 'plist',
			label: 'Roster',
			icon: 'list-ul',
			onSelect: () => emit('lenix:server:roster:toggleDisplay'),
		})
	else removeRadialItem('plist')
})

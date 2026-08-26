import { addRadialItem, checkDependency, notify, onCache, removeRadialItem } from '@overextended/ox_lib/client'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('illenium-appearance', '5.7.0', true)
checkDependency('ox_core', '1.5.14', true)

addRadialItem([
	{
		id: 'escort',
		label: 'Escort',
		icon: 'user-group',
		onSelect: () => emit('lenix:client:interactions:escort'),
	},
	{
		id: 'put-in-vehicle',
		label: 'Put in vehicle',
		icon: 'arrow-right-to-bracket',
		onSelect: () => emit('lenix:client:interactions:putInVehicle'),
	},
	{
		id: 'take-out-vehicle',
		label: 'Take out of vehicle',
		icon: 'arrow-right-from-bracket',
		onSelect: () => emit('lenix:client:interactions:takeOutVehicle'),
	},
	{
		id: 'reload',
		label: 'Reload',
		icon: 'shirt',
		onSelect: () => emit('illenium-appearance:client:reloadSkin'),
	},
	{
		id: 'settings',
		label: 'Settings',
		icon: 'gear',
		onSelect: () => emit('lenix:client:settings:open'),
	},
	{
		id: 'weather',
		label: 'Weather & Time',
		icon: 'cloud-moon',
		onSelect: () => notify({ title: 'Not available yet!' }) /* emit('lenix:client:weather:open') */,
	},
	{
		id: 'emote',
		label: 'Emotes',
		icon: 'person-walking',
		onSelect: () => notify({ title: 'Not available yet!' }),
	},
])

onCache('vehicle', vehicle => {
	if (vehicle) {
		addRadialItem({
			id: 'vehicle-menu',
			label: 'Vehicle',
			icon: 'car',
			onSelect: () => notify({ title: 'Not available yet!' }),
		})
		return
	}
	removeRadialItem('vehicle-menu')
})

onNet('ox:setGroup', (groupName: string, _grade: number) => {
	if (groupName === 'police') {
		addRadialItem({
			id: 'plist',
			label: 'Roster',
			icon: 'list-ul',
			onSelect: () => emit('lenix:server:roster:toggleDisplay'),
		})
		return
	}
	removeRadialItem('plist')
})

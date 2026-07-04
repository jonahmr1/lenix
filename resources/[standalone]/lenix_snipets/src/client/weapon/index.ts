on('ox_inventory:currentWeapon', (weapon: {
	ammo: string
	metadata: {
		ammo: number
	}
} | undefined) => {
	if (!weapon) return
	
	const clip = weapon.metadata.ammo
	const reserve = exports.ox_inventory.Search('count', weapon.ammo)
	SendNuiMessage(JSON.stringify({
		key: 'update',
		value: { clip, reserve }
	}))
})

on('ox:playerLoaded', () => {
  SendNuiMessage(JSON.stringify({
		key: 'display',
		value: true
	}))
});

onNet('ox:startCharacterSelect', () => {
	SendNuiMessage(JSON.stringify({
		key: 'display',
		value: false
	}))
});

onNet('ox:interactions:put', (targetId: number, vehicleNetId: number, seat: number) => {
	emitNet('ox:toggleEscort', targetId, 0, false)
	SetPedIntoVehicle(GetPlayerPed(targetId.toString()), NetworkGetEntityFromNetworkId(vehicleNetId), seat)
})

onNet('ox:interactions:take', (targetId: number, vehicleNetId: number) => {
	TaskLeaveVehicle(GetPlayerPed(targetId.toString()), NetworkGetEntityFromNetworkId(vehicleNetId), 16);
})
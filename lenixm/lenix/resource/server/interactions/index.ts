onNet('lenix:server:interactions:setInVehicle', (targetId: number, vehicleNetId: number, seat: number) => {
	emitNet('lenix:client:escort:toggle', targetId, 0, false)
	SetPedIntoVehicle(GetPlayerPed(targetId.toString()), NetworkGetEntityFromNetworkId(vehicleNetId), seat)
})

onNet('lenix:server:interactions:setOutVehicle', (targetId: number, vehicleNetId: number) => {
	TaskLeaveVehicle(GetPlayerPed(targetId.toString()), NetworkGetEntityFromNetworkId(vehicleNetId), 16)
})

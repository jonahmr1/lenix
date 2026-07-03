onNet('ox:server:interactions:put', (targetId: number, vehicle: number, seat: number) => {
	TaskWarpPedIntoVehicle(GetPlayerPed(targetId.toString()), vehicle, seat)
})
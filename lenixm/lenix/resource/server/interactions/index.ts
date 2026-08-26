const cuffs: Record<number, boolean> = {}
const escorts: Record<number, boolean> = {}

const updateState = (targetId: number, source: number, newState: boolean) => {
	emitNet('lenix:client:interaction:getEscorted', targetId, source, newState)
	Player(targetId).state.isEscorted = newState
	escorts[targetId] = newState
}

onNet('lenix:server:interactions:cuff', (targetId: number) => {
	const newState = !cuffs[targetId]
	cuffs[targetId] = newState

	emitNet('lenix:client:interactions:getCuffed', targetId, source, newState)
	Player(targetId).state.isCuffed = newState
	Player(targetId).state.invBusy = newState
	Player(targetId).state.isEscorted = !newState && false
})

onNet('lenix:server:interactions:setInVehicle', (targetId: number, vehicleNetId: number, seat: number) => {
	emitNet('lenix:client:interaction:getEscorted', targetId, 0, false)
	SetPedIntoVehicle(GetPlayerPed(targetId.toString()), NetworkGetEntityFromNetworkId(vehicleNetId), seat)
})

onNet('lenix:server:interactions:setOutVehicle', (targetId: number, vehicleNetId: number) => {
	TaskLeaveVehicle(GetPlayerPed(targetId.toString()), NetworkGetEntityFromNetworkId(vehicleNetId), 16)
})

onNet('lenix:server:interactions:escort', (targetId: number) => {
	updateState(targetId, source, !escorts[targetId])
})

AddStateBagChangeHandler('isCuffed', '', (name: string, _key: string, value: boolean) => {
	if (value) return
	const playerId = Number(name.replace('player:', ''))
	updateState(playerId, 0, value)
})

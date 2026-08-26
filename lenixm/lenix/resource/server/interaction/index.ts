const cuffs: Record<number, boolean> = {}
const escorts: Record<number, boolean> = {}

const updateState = (targetId: number, source: number, newState: boolean) => {
	emitNet('lenix:client:interaction:getEscorted', targetId, source, newState)
	Player(targetId).state.isEscorted = newState
	escorts[targetId] = newState
}

onNet('lenix:server:interaction:cuff', (targetId: number) => {
	const newState = !cuffs[targetId]
	cuffs[targetId] = newState

	emitNet('lenix:client:interaction:getCuffed', targetId, source, newState)
	Player(targetId).state.isCuffed = newState
	Player(targetId).state.invBusy = newState
	Player(targetId).state.isEscorted = !newState && false
})

onNet('lenix:server:interaction:setInVehicle', (targetId: number, vehicleNetId: number, seat: number) => {
	emitNet('lenix:client:interaction:getEscorted', targetId, 0, false)
	SetPedIntoVehicle(GetPlayerPed(targetId.toString()), NetworkGetEntityFromNetworkId(vehicleNetId), seat)
})

onNet('lenix:server:interaction:setOutVehicle', (targetId: number, vehicleNetId: number) => {
	TaskLeaveVehicle(GetPlayerPed(targetId.toString()), NetworkGetEntityFromNetworkId(vehicleNetId), 16)
})

onNet('lenix:server:interaction:escort', (targetId: number) => {
	updateState(targetId, source, !escorts[targetId])
})

AddStateBagChangeHandler('isCuffed', '', (name: string, _key: string, value: boolean) => {
	if (value) return
	const playerId = Number(name.replace('player:', ''))
	updateState(playerId, 0, value)
})

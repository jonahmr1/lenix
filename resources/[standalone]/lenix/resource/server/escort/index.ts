const escorts: Record<number, boolean> = {}

const updateState = (targetId: number, source: number, newState: boolean) => {
	emitNet('ox:toggleEscort', targetId, source, newState)
	Player(targetId).state.isEscorted = newState
	escorts[targetId] = newState
}

onNet('ox:server:escort', (targetId: number) => {
	updateState(targetId, source, !escorts[targetId])
})

AddStateBagChangeHandler('isCuffed', '', (name: string, _key: string, value: boolean) => {
	if (value) return
	const playerId = Number(name.replace('player:', ''))
	updateState(playerId, 0, value)
})

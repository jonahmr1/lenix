const cuffs: Record<number, boolean> = {}

onNet('ox:server:toggleCuffs', (targetId: number) => {
	const newState = !cuffs[targetId]
	cuffs[targetId] = newState

	emitNet('ox:client:toggleCuffs', targetId, source, newState)
	Player(targetId).state.isCuffed = newState
	Player(targetId).state.invBusy = newState
	Player(targetId).state.isEscorted = !newState && false
})

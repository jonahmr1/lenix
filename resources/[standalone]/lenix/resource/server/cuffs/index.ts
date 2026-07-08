const cuffs: Record<number, boolean> = {}

onNet('lenix:server:cuffs:toggle', (targetId: number) => {
	const newState = !cuffs[targetId]
	cuffs[targetId] = newState

	emitNet('lenix:client:cuffs:toggle', targetId, source, newState)
	Player(targetId).state.isCuffed = newState
	Player(targetId).state.invBusy = newState
	Player(targetId).state.isEscorted = !newState && false
})

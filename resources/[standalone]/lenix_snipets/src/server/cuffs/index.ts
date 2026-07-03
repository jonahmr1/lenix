const cuffs: Record<number, boolean> = {}

onNet('ox:server:cuffPlayer', (targetId: number) => {
	if (cuffs[targetId]) {
		cuffs[targetId] = false
		emitNet('ox:releaseCuff', targetId)
		Player(targetId).state.isCuffed = false
		Player(targetId).state.invBusy = false
	} else {
		cuffs[targetId] = true
		emitNet('ox:getCuffed', targetId, source)
		Player(targetId).state.isCuffed = cuffs[targetId]
		Player(targetId).state.invBusy = cuffs[targetId]
	}
})
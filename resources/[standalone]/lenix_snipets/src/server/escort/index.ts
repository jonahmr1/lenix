import { GetPlayer } from "@overextended/ox_core/server";

export const toggleEscort = (source: number, targetId: number) => {
	const escorter = GetPlayer(source)
	const target = GetPlayer(targetId)
	if (!escorter || !target) return
	if (!Player(targetId).state.isCuffed) return // only escort cuffed players

	const isEscorted = Player(targetId).state.isEscorted
	Player(targetId).state.set('isEscorted', isEscorted ? false : source, true)
}

onNet('ox:toggleEscort', (targetId: number) => {
	toggleEscort(source, targetId)
})

onNet('ox:breakFree', () => {
	if (!Player(source).state.isEscorted) return
	Player(source).state.set('isEscorted', false, true)
})

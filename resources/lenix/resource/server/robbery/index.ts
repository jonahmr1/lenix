import { createVehicle, onClientCallback } from "@overextended/ox_lib/server"
import { MIN_TEAMS_TO_START_ROBBERY, VEHICLE_COORDS, VEHICLE_MODEL } from "common/robbery"
import type { Team } from "types/index"

const teams = new Map<number, Team>()
let isRobberyRunning: boolean = false

const startNewRobbery = async () => {
	isRobberyRunning = true
	await createVehicle(VEHICLE_MODEL, 'automobile', ...VEHICLE_COORDS)

	// teams.forEach(team => {
	// 	team.teammates.forEach(teammate => {
	// 		emitNet('ox_lib:notify', teammate, {
	// 			type: 'success',
	// 			title: 'A new truck to rob can be found in the map'
	// 		})
	// 	})
	// })
}

const addPlayerToRobbery = (leader: number, playerId: number) => {
	teams.set(leader, { leader, teammates: [playerId] })

}

onClientCallback('lenix:server:robbery:createteam', async (playerId): Promise<Team | undefined> => {
	if (!isRobberyRunning && teams.size >= MIN_TEAMS_TO_START_ROBBERY) {
		startNewRobbery()
	}
	addPlayerToRobbery(playerId, playerId)
	return teams.get(playerId)
})

onNet('lenix:server:robbery:leaveteam', () => {
  const team = [...teams.values()].find(team => team.teammates.includes(source))
  if (!team) return
  team.teammates = team.teammates.filter(teammate => teammate !== source)
	team.teammates.forEach(teammate => {
		emitNet('lenix:client:robbery:updateteam', teammate, team)
	})
})

onNet('lenix:server:robbery:destroyteam', () => {
  teams.delete(source)
})
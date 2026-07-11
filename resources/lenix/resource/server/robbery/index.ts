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

const refreshTeam = (team: Team) => {
	team.teammates.forEach(teammate => {
    emitNet('lenix:client:robbery:updateteam', teammate, team)
  })
}

onClientCallback('lenix:server:robbery:createteam', async (leader): Promise<Team | undefined> => {
	if (!isRobberyRunning && teams.size >= MIN_TEAMS_TO_START_ROBBERY) {
		startNewRobbery()
	}
	teams.set(leader, { leader, teammates: [leader] })
	return teams.get(leader)
})

onNet('lenix:server:robbery:leaveteam', () => {
  const team = [...teams.values()].find(team => team.teammates.includes(source))
  if (!team) return
	
  team.teammates = team.teammates.filter(teammate => teammate !== source)
	refreshTeam(team)
})

onNet('lenix:server:robbery:destroyteam', () => {
  teams.delete(source)
})

onNet('lenix:server:robbery:kickteammate', (target: number) => {
	const team = teams.get(source)
	if (!team) return

  team.teammates = team.teammates.filter(teammate => teammate !== target)
	refreshTeam(team)
})

onNet('lenix:server:robbery:invite', (playerId: number) => {
	emitNet('lenix:server:robbery:receiveinvite', playerId, source)
})

onNet('lenix:server:robbery:addteammate', (leader: number) => {
	const team = teams.get(leader)
	if (!team) return

	team?.teammates.push(source)
	refreshTeam(team)
})
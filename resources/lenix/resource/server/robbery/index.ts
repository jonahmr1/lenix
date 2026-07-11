import { createVehicle, onClientCallback } from "@overextended/ox_lib/server"
import { MIN_TEAMS_TO_START_ROBBERY, MISSION_PRICE, random, VEHICLE_BLIP_UPDATE_INTERVAL, VEHICLE_COORDS, VEHICLE_MODEL } from "common/robbery"
import type { Team } from "types/index"

const teams = new Map<number, Team>()
let isRobberyRunning: boolean = false

const refreshTeam = (team: Team) => {
	team.teammates.forEach(teammate => {
    emitNet('lenix:client:robbery:updateteam', teammate, team)
  })
}

const addPlayerToRobbery = (playerId: number) => {
	emitNet('ox_lib:notify', playerId, {
		type: 'success',
		title: 'A new truck to rob can be found in the map'
	})
}

onClientCallback('lenix:server:robbery:createteam', async (leader): Promise<Team | undefined> => {
	const result = globalThis.exports.ox_inventory.RemoveItem(leader, 'money', MISSION_PRICE)
	const [success, response] = Array.isArray(result) ? result : [result, undefined]
	if (!success) throw new Error(`Could not create team for player<${leader}>, reason: ${response}`)

	teams.set(leader, { leader, teammates: [leader] })
	
	if (!isRobberyRunning && teams.size >= MIN_TEAMS_TO_START_ROBBERY) {
		isRobberyRunning = true
		const randomIndex = random(VEHICLE_COORDS.length)
		const coords = VEHICLE_COORDS[randomIndex]
		if (!coords) throw new Error(`Failed to get the coords at #${randomIndex} from VEHICLE_COORDS`)

		const vehicle = await createVehicle(VEHICLE_MODEL, 'automobile', ...coords)
		teams.forEach(team => {
			team.teammates.forEach(teammate => {
				addPlayerToRobbery(teammate)
			})
		})

		emitNet('lenix:client:robbery:spawnPeds', -1, vehicle.netId)

		setInterval(() => {
			GlobalState.robberyVehicleCoords = vehicle.getCoords()
		}, VEHICLE_BLIP_UPDATE_INTERVAL)

		on('onResourceStop', () => {
			DeleteEntity(vehicle.handle)
		})
	}
	return teams.get(leader)
})

onNet('lenix:server:robbery:leaveteam', () => {
  const team = [...teams.values()].find(team => team.teammates.includes(source))
  if (!team) return

  team.teammates = team.teammates.filter(teammate => teammate !== source)
	refreshTeam(team)
})

onNet('lenix:server:robbery:destroyteam', () => {
	const team = teams.get(source)
	if (!team) return

	team.teammates.forEach(teammate => {
		emitNet('lenix:client:robbery:removefromteam', teammate)
	})
  teams.delete(source)
})

onNet('lenix:server:robbery:kickteammate', (target: number) => {
	const team = teams.get(source)
	if (!team) return

  team.teammates = team.teammates.filter(teammate => teammate !== target)
	refreshTeam(team)
})

onNet('lenix:server:robbery:jointeam', (leader: number) => {
	const team = teams.get(leader)
	if (!team) return

	team?.teammates.push(source)
	refreshTeam(team)
	emitNet('ox_lib:notify', source, {
		title: 'New player joined the team'
	})
	if (isRobberyRunning) addPlayerToRobbery(source)
})

onNet('lenix:server:robbery:invite', (playerId: number) => {
	if (!GetPlayerPed(playerId.toString()) || playerId === source) {
		emitNet('ox_lib:notify', source, {
			type: 'error',
			title: 'Unvalid Id'
		})
		return
	}
	
	const targetTeam = [...teams.values()].find(team => team.teammates.includes(playerId))
  if (targetTeam) {
		emitNet('ox_lib:notify', source, {
			type: 'error',
			title: 'Player is already in another team'
		})
		return
	}

	emitNet('lenix:client:robbery:receiveinvite', playerId, source)
})
import type { Team, Vector3, Vector4 } from "types/index";
import { spawnPed, useTimer } from "../_lib";
import { alertDialog, cache, hideTextUI, inputDialog, notify, registerContext, requestModel, showContext, showTextUI, triggerServerCallback, waitFor } from "@overextended/ox_lib/client";
import { MISSION_PRICE, PEDS_MODEL, VEHICLE_MODEL } from "common/robbery";
import type { Vec3 } from "@overextended/core/vector";

const PED_COORDS: Vector4 = [16.1564, -615.8132, 31.7635, 260.8470]

let team: Team | undefined
let inviteTick: number
let blip: number

const isInTeam = () => !!team?.teammates.find(teammate => teammate === cache.serverId)
const isLeader = () => team?.leader === cache.serverId

const createTeam = async () => {
	const moneyAmount = globalThis.exports.ox_inventory.GetItemCount('money')
	if (moneyAmount < MISSION_PRICE) {
		notify({
			type: 'error',
			title: 'Not enough money!',
			description: `You need ${MISSION_PRICE - moneyAmount} more`
		})
		return
	}
	const teamCreated = await triggerServerCallback<Team | undefined>('lenix:server:robbery:createteam', null)
	if (!teamCreated) return

	team = teamCreated
	refreshContext()
}

const refreshContext = () => {
	registerContext({
		id: 'robbery-mission',
		title: 'Robbery Mission',
		options: [
			{
				title: `Create team ($${MISSION_PRICE})`,
				disabled: isLeader() || isInTeam(),
				onSelect: async () => {
					createTeam()
				}
			},
			{
				title: 'Invite teammate',
				disabled: !isLeader(),
				onSelect: async () => {
					const input = await inputDialog('Invite a teammate', [
						{
							type: 'number',
							label: 'Player Id'
						}
					], {})
					if (!input) return

					emitNet('lenix:server:robbery:invite', input[0])
				}
			},
			{
				title: 'Kick teammate',
				disabled: !isLeader(),
				onSelect: () => {
					showContext('robbery-mission-kick')
				}
			},
			{
				title: 'Leave team',
				disabled: !isInTeam() || isLeader(),
				onSelect: () => {
					emitNet('lenix:server:robbery:leaveteam')
					team = undefined
					refreshContext()
				}
			},
			{
				title: 'Delete team',
				disabled: !isLeader(),
				onSelect: () => {
					emitNet('lenix:server:robbery:destroyteam')
					refreshContext()
				}
			},
		]
	})

	registerContext({
		id: 'robbery-mission-kick',
		title: 'Kick a teammate',
		options: (() => {
			const teammates = team?.teammates.filter(t => t !== team?.leader) ?? []
			return teammates.length > 0
				? teammates.map(teammate => ({
						title: `${teammate}`,
						onSelect: () => emitNet('lenix:server:robbery:kickteammate', teammate)
					}))
				: [{ title: 'No teammates found', readOnly: true }]
		})()
	})
}

onNet('lenix:client:robbery:updateteam', (updatedTeam: Team) => {
	team = updatedTeam
	refreshContext()
})

onNet('lenix:client:robbery:receiveinvite', (inviter: number) => {
	if (inviteTick) return

  const stop = useTimer(
    10000,
    1000,
    (timeLeft) => {
      showTextUI(`E - Show robbery invite - ${Math.ceil(timeLeft / 1000)}s`, {
        position: 'bottom-center'
      })
    },
    () => {
      hideTextUI()
      clearTick(inviteTick)
			inviteTick = 0
    }
  )

  inviteTick = setTick(async () => {
    if (IsControlJustPressed(0, 38)) {
      stop()
      hideTextUI()
      clearTick(inviteTick)
			inviteTick = 0
      const res = await alertDialog({
        header: 'Robbery Invite',
        content: `The player #${inviter} is inviting you to join the robbery mission`,
				centered: true,
				cancel: true
      })
      if (res === 'cancel') return
      emitNet('lenix:server:robbery:jointeam', inviter)
    }
  })
})

onNet('lenix:client:robbery:removefromteam', () => {
	team = undefined
})


AddStateBagChangeHandler('robberyVehicleCoords', null, (_bag: string, key: string, value: Vec3) => {
  if (!value || key !== 'robberyVehicleCoords') {
    RemoveBlip(blip)
    blip = -1
    return
  }
	const coords: Vector3 = [value.x, value.y, value.z]
  if (DoesBlipExist(blip)) {
    SetBlipCoords(blip, ...coords)
    return
  }
  blip = AddBlipForCoord(...coords)
  SetBlipSprite(blip, 67)
  SetBlipColour(blip, 27)
  SetBlipAsShortRange(blip, false)
})

onNet('lenix:client:robbery:spawnPeds', async (vehicleNetId: number) => {
	const entity = await new Promise<number>((resolve) => {
		const interval = setInterval(() => {
			const ent = NetworkGetEntityFromNetworkId(vehicleNetId)
			if (ent > 0 && DoesEntityExist(ent)) {
				clearInterval(interval)
				resolve(ent)
			}
		}, 100)
	})

  if (!entity) return
  if (NetworkGetEntityOwner(entity) !== PlayerId()) return

  const seats = GetVehicleModelNumberOfSeats(GetHashKey(VEHICLE_MODEL))
	const hash = await requestModel(PEDS_MODEL)

  for (let seat = -1; seat < seats - 1; seat++) {
    const ped = CreatePedInsideVehicle(entity, 26, hash, seat, true, false)
    if (seat === -1) TaskVehicleDriveWander(ped, entity, 20.0, 786468)
  }
})

setImmediate(async () => {
	const entity = await spawnPed(PED_COORDS)
	if (!entity) return

	globalThis.exports.ox_target.addLocalEntity(entity, {
		label: 'Robbery Mission',
		onSelect: () => {
			refreshContext()
			showContext('robbery-mission')
		}
	})

	if (cache.serverId === 8) createTeam()
})
import type { Team, Vector3, Vector4 } from "types/index";
import { getClosestPlayer, spawnPed, useTimer } from "../_lib";
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
	const peds: number[] = []
	let guardsAlerted = false

	for (let seat = -1; seat < seats - 1; seat++) {
		const ped = CreatePedInsideVehicle(entity, 26, hash, seat, true, false)
		SetBlockingOfNonTemporaryEvents(ped, true)
		SetPedFleeAttributes(ped, 0, false)
		GiveWeaponToPed(ped, GetHashKey('weapon_pistol'), 9999, false, true)
		SetPedInfiniteAmmo(ped, true, GetHashKey('weapon_pistol'))
		SetCurrentPedWeapon(ped, GetHashKey('weapon_pistol'), true)
		SetPedCombatAttributes(ped, 0, true)
		SetPedCombatAttributes(ped, 46, true)
		SetPedCombatAttributes(ped, 5, true)
		SetPedCombatRange(ped, 2)
		SetPedCombatAbility(ped, 2)
		SetPedCombatMovement(ped, 3)
		SetPedConfigFlag(ped, 183, true)
		SetPedConfigFlag(ped, 4, true)
		SetPedShootRate(ped, 50)
		if (seat === -1) TaskVehicleDriveWander(ped, entity, 20.0, 786468)
		peds.push(ped)
	}
	
	setTick(() => {
		if (NetworkGetEntityOwner(entity) !== PlayerId()) return
	
		if (!guardsAlerted) {
			for (let door = 0; door < 6; door++) {
				if (GetVehicleDoorAngleRatio(entity, door) > 0.1) {
					guardsAlerted = true
					peds.forEach(ped => {
						SetBlockingOfNonTemporaryEvents(ped, false)
						SetPedFleeAttributes(ped, 0, false)
						TaskLeaveVehicle(ped, entity, 0)
					})
					break
				}
			}
		}
	
		if (guardsAlerted) {
			peds.forEach(ped => {
				if (IsEntityDead(ped)) return
				if (IsPedInAnyVehicle(ped, false)) return
				if (IsPedInCombat(ped, 0)) return
				const pedCoords = GetEntityCoords(ped, true) as Vector3
				const { playerPed } = getClosestPlayer(pedCoords, 100.0, true)
				if (playerPed) TaskCombatPed(ped, playerPed, 0, 16)
			})
		}
	})
	SetVehicleDoorShut(entity, 4, false)
	SetVehicleDoorShut(entity, 5, false)

	globalThis.exports.ox_target.addLocalEntity(entity, [
		{
			label: 'Break Door (Left)',
			onSelect: async () => {
				const success = globalThis.exports['glitch-minigames'].StartPlasmaDrilling(5)
				if (!success) return
				emitNet('lenix:server:robbery:breakdoor', vehicleNetId, 4)
			}
		},
		{
			label: 'Break Door (Right)',
			onSelect: async () => {
				const success = globalThis.exports['glitch-minigames'].StartPlasmaDrilling(5)
				if (!success) return
				emitNet('lenix:server:robbery:breakdoor', vehicleNetId, 5)
			}
		}
	])
})

onNet('lenix:client:robbery:opendoors', (vehicleNetId: number) => {
  const entity = NetworkGetEntityFromNetworkId(vehicleNetId)
  if (!DoesEntityExist(entity)) return
  SetVehicleDoorOpen(entity, 4, false, false)
  SetVehicleDoorOpen(entity, 5, false, false)
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
})
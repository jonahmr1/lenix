
import { notify, progressBar, requestModel } from "@overextended/ox_lib/client"
import { DRILL_ITEM, PEDS_MODEL, VEHICLE_MODEL } from "common/robbery"
import type { Vector3 } from "types/index"
import { getClosestPlayer } from "../_lib"
import { team } from "."

const vehicleDoorsBroken = {
	left: false,
	right: false
}
let blip: number
let vehNetId: number

AddStateBagChangeHandler('robberyVehicleCoords', null, (_bag: string, key: string, coords: Vector3) => {
  if (!coords || key !== 'robberyVehicleCoords') {
    RemoveBlip(blip)
    blip = -1
    return
  }
  if (DoesBlipExist(blip)) {
    SetBlipCoords(blip, ...coords)
    return
  }
  blip = AddBlipForCoord(...coords)
  SetBlipSprite(blip, 67)
  SetBlipColour(blip, 27)
  SetBlipAsShortRange(blip, false)
})

onNet('lenix:client:robbery:startrobbery', async (vehicleNetId: number) => {
	const vehicle = await new Promise<number>((resolve) => {
		const interval = setInterval(() => {
			const entity = NetworkGetEntityFromNetworkId(vehicleNetId)
			if (entity > 0 && DoesEntityExist(entity)) {
				clearInterval(interval)
				resolve(entity)
			}
		}, 100)
	})

  if (!vehicle || NetworkGetEntityOwner(vehicle) !== PlayerId()) return
	vehNetId = vehicleNetId
	notify({
		title: 'The guards have been notified'
	})

  const seats = GetVehicleModelNumberOfSeats(GetHashKey(VEHICLE_MODEL))
	const hash = await requestModel(PEDS_MODEL)
	const peds: number[] = []
	let guardsAlerted = false

	for (let seat = -1; seat < seats - 1; seat++) {
		const ped = CreatePedInsideVehicle(vehicle, 26, hash, seat, true, false)
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
		if (seat === -1) TaskVehicleDriveWander(ped, vehicle, 20.0, 786468)
		peds.push(ped)
	}

	const tick = setTick(() => {
		if (NetworkGetEntityOwner(vehicle) !== PlayerId()) return
		if (!guardsAlerted) {
			if (GetVehicleDoorAngleRatio(vehicle, 1) > 0.1 || GetVehicleDoorAngleRatio(vehicle, 3) > 0.1) {
				guardsAlerted = true
				peds.forEach(ped => {
					SetBlockingOfNonTemporaryEvents(ped, false)
					SetPedFleeAttributes(ped, 0, false)
					TaskLeaveVehicle(ped, vehicle, 0)
				})
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

	//TODO check bones
	globalThis.exports.ox_target.addEntity(vehicleNetId, [
		{
			name: 'left-door',
			label: 'Break Left Door',
			bones: 'door_dside_r',
			canInteract: () => {
				if (!team) return

				return true
			},
			onSelect: async () => {
				const success = await globalThis.exports['glitch-minigames'].StartPlasmaDrilling(5)
				if (!success) return

				emitNet('lenix:server:robbery:breakdoor', 'left')
				globalThis.exports.ox_target.removeEntity(vehicleNetId, 'left-door')
			}
		},
		{
			name: 'right-door',
			label: 'Break Right Door',
			bones: 'door_pside_r',
			canInteract: () => {
				if (!team) return

				return true
			},
			onSelect: async () => {
				const drillAmount = globalThis.exports.ox_inventory.GetItemCount(DRILL_ITEM)
				if (drillAmount < 1) {
					notify({
						title: 'You\'re missing a drill'
					})
					return
				}
				const success = await globalThis.exports['glitch-minigames'].StartPlasmaDrilling(5)
				if (!success) return

				emitNet('lenix:server:robbery:breakdoor', 'right')
				globalThis.exports.ox_target.removeEntity(vehicleNetId, 'right-door')
			}
		},
		{
			name: 'take-money',
			label: 'Take Money',
			bones: ['door_pside_r', 'door_dside_r'],
			canInteract: () => {
				if (!team) return

				return vehicleDoorsBroken['left'] && vehicleDoorsBroken['right']
			},
			onSelect: async () => {
				const drillAmount = globalThis.exports.ox_inventory.GetItemCount(DRILL_ITEM)
				if (drillAmount < 1) {
					notify({
						title: 'You\'re missing a drill'
					})
					return
				}
				for (const ped of peds) {
					if (!IsEntityDead(ped)) {
						notify({
							title: 'Take the guards first'
						})
						return
					}
				}
				clearTick(tick)

				const res = await progressBar({
					label: 'Taking money',
					duration: 10000,
					canCancel: true,
					disable: {
						combat: true,
						move: true,
					},
					anim: {
						dict: 'anim@scripted@heist@ig1_table_grab@gold@male@',
						clip: 'grab'
					},
					prop: {
						model: 'hei_p_m_bag_var22_arm_s',
						bone: 24818,
						pos: {
							x: -0.31,
							y: 0.0,
							z: 0.0,
						},
						rot: {
							x: 160.0,
							y: -85.0,
							z: 10.0,
						},
					},
				})
				if (!res) return

				emitNet('lenix:server:robbery:takemoney', vehicleNetId)
				globalThis.exports.ox_target.removeEntity(vehicleNetId, 'take-money')
			}
		},
	])
})

onNet('lenix:client:robbery:opendoors', (side: 'left' | 'right') => {
	vehicleDoorsBroken[side] = true

	if (!vehicleDoorsBroken['left'] || !vehicleDoorsBroken['right']) return

	const entity = NetToVeh(vehNetId)
	SetVehicleDoorOpen(entity, 2, false, false)
	SetVehicleDoorOpen(entity, 3, false, false)
})

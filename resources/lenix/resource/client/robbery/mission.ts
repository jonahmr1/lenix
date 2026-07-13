import type { Vec3 } from "@overextended/core/vector"
import { progressBar, requestModel } from "@overextended/ox_lib/client"
import { PEDS_MODEL, VEHICLE_MODEL } from "common/robbery"
import type { Vector3 } from "types/index"
import { getClosestPlayer } from "../_lib"

const vehicleDoorsBroken = {
	left: false,
	right: false
}
let blip: number
let veh: number

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
	const vehicle = await new Promise<number>((resolve) => {
		const interval = setInterval(() => {
			const ent = NetworkGetEntityFromNetworkId(vehicleNetId)
			if (ent > 0 && DoesEntityExist(ent)) {
				clearInterval(interval)
				resolve(ent)
			}
		}, 100)
	})

  if (!vehicle || NetworkGetEntityOwner(vehicle) !== PlayerId()) return
	veh = vehicle

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

	SetVehicleDoorsLocked(vehicle, 10)
	
	setTick(() => {
		if (NetworkGetEntityOwner(vehicle) !== PlayerId()) return
	
		if (!guardsAlerted) {
			for (let door = 0; door < GetNumberOfVehicleDoors(vehicle); door++) {
				if (GetVehicleDoorAngleRatio(vehicle, door) > 0.1) {
					guardsAlerted = true
					peds.forEach(ped => {
						SetBlockingOfNonTemporaryEvents(ped, false)
						SetPedFleeAttributes(ped, 0, false)
						TaskLeaveVehicle(ped, vehicle, 0)
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

	//TODO check bones
	globalThis.exports.ox_target.addEntity(vehicleNetId, [
		{
			label: 'Break Left Door',
			canInteract: () => !vehicleDoorsBroken.left,
			onSelect: async () => {
				const success = await globalThis.exports['glitch-minigames'].StartPlasmaDrilling(5)
				if (!success) return

				emitNet('lenix:server:robbery:breakdoor', 'left', vehicleNetId)
			}
		},
		{
			label: 'Break Right Door',
			canInteract: () => !vehicleDoorsBroken.right,
			onSelect: async () => {
				const success = await globalThis.exports['glitch-minigames'].StartPlasmaDrilling(5)
				if (!success) return

				emitNet('lenix:server:robbery:breakdoor', 'right', vehicleNetId)
			}
		}
	])
})

onNet('lenix:client:robbery:opendoors', (side: 'left' | 'right', vehicleNetId: number) => {
	vehicleDoorsBroken[side] = true

	if (!vehicleDoorsBroken['left'] || !vehicleDoorsBroken['right']) return

	SetVehicleDoorsLocked(veh, 0)
	SetVehicleDoorOpen(veh, 3, true, false)
	SetVehicleDoorOpen(veh, 4, true, false)
	SetVehicleDoorOpen(veh, 5, true, false)
	globalThis.exports.ox_target.addEntity(vehicleNetId, [
		{
			label: 'Take Money',
			onSelect: async () => {
				const res = await progressBar({
					label: 'Taking money',
					duration: 10000,
					canCancel: true,
					disable: {
						combat: true,
						move: true,
					},
					anim: {
						dict: 'anim@heists@ornate_bank@grab_gold',
						clip: 'grab'
					},
					prop: {
						model: 'hei_p_m_bag_var22_arm_s',
						bone: 24818, // SKEL_SPINE2
						pos: {
								x: 0.12,
								y: -0.24,
								z: 0.0,
						},
						rot: {
								x: 0.0,
								y: 90.0,
								z: 180.0,
						},
				},
				})
				if (!res) return

				emitNet('lenix:server:robbery:takemoney', vehicleNetId)
			}
		},
	])
})
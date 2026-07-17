import type { Team } from "types/index";
import { alertDialog, cache, createPed, hideTextUI, inputDialog, registerContext, showContext, showTextUI, triggerServerCallback } from "@overextended/ox_lib/client";
import { MISSION_PRICE, PED_COORDS } from "common/robbery";
import { client, useTimer } from "lenix/client";
import { notify, progressBar, requestModel } from "@overextended/ox_lib/client"
import { DRILL_ITEM, PEDS_MODEL, VEHICLE_MODEL } from "common/robbery"
import type { Vector3 } from "types/index"
import { getNearest } from "lenix/client"

let blip: number
let inviteTick: number
let blipTick: number
let team: Team | undefined
const vehicleDoorsBroken = {
	left: false,
	right: false
}

const isInTeam = () => !!team?.members.find(member => member === cache.serverId)
const isLeader = () => team?.leader === cache.serverId

const refreshContext = async () => {
	registerContext({
		id: 'robbery-mission',
		title: 'Robbery Mission',
		options: [
			{
				title: `Create team ($${MISSION_PRICE})`,
				disabled: isLeader() || isInTeam(),
				onSelect: async () => {
					emitNet('lenix:server:robbery:createTeam')
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
					emitNet('lenix:server:robbery:leaveTeam')
				}
			},
			{
				title: 'Delete team',
				disabled: !isLeader(),
				onSelect: () => {
					emitNet('lenix:server:robbery:deleteTeam')
				}
			},
		]
	})

	registerContext({
		id: 'robbery-mission-kick',
		title: 'Kick a teammate',
		options: (() => {
			const teammates = team?.members.filter(member => member !== team?.leader) ?? []
			return teammates.length > 0
				? teammates.map(teammate => ({
					title: `${teammate}`,
					onSelect: () => emitNet('lenix:server:robbery:kickMember', teammate)
				}))
				: [{ title: 'No teammates found', readOnly: true }]
		})()
	})
}

onNet('lenix:client:robbery:receiveInvite', (inviter: number) => {
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
				content: `The player #${inviter} is inviting you to join his to a robbery mission`,
				centered: true,
				cancel: true
			})
			emitNet('lenix:server:robbery:inviteDone', inviter, res satisfies 'cancel' | 'confirm')
		}
	})
})

onNet('lenix:client:robbery:updatePlayer', (updatedTeam: Team | undefined) => {
	if (!team) {
		clearTick(blipTick)
	}
	team = updatedTeam
	refreshContext()
})

onNet('lenix:client:robbery:startrobbery', async (netId: number) => {
	const vehicle = await new Promise<number>((resolve) => {
		const interval = setInterval(() => {
			const entity = NetworkGetEntityFromNetworkId(netId)
			if (entity > 0 && DoesEntityExist(entity)) {
				clearInterval(interval)
				resolve(entity)
			}
		}, 100)
	})

	if (!vehicle) return

	const seats = GetVehicleModelNumberOfSeats(GetHashKey(VEHICLE_MODEL))
	const hash = await requestModel(PEDS_MODEL)
	const peds: number[] = []
	let guardsFedUp = false

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

	blipTick = setTick(() => {
		if (NetworkGetEntityOwner(vehicle) !== PlayerId()) return
		
		if (guardsFedUp) {
			peds.forEach(ped => {
				if (IsEntityDead(ped)) return
				if (IsPedInAnyVehicle(ped, false)) return
				if (IsPedInCombat(ped, 0)) return
				const pedCoords = GetEntityCoords(ped, true) as Vector3
				const { playerPed } = getNearest.player(pedCoords, 100.0, true)
				if (playerPed) TaskCombatPed(ped, playerPed, 0, 16)
			})
		} else if (GetVehicleDoorAngleRatio(vehicle, 1) > 0.1 || GetVehicleDoorAngleRatio(vehicle, 3) > 0.1) {
			guardsFedUp = true
			peds.forEach(ped => {
				SetBlockingOfNonTemporaryEvents(ped, false)
				SetPedFleeAttributes(ped, 0, false)
				TaskLeaveVehicle(ped, vehicle, 0)
			})
		}
	})
	
	const breakDoor = async (side: 'left' | 'right') => {
		const drillAmount = globalThis.exports.ox_inventory.GetItemCount(DRILL_ITEM)
		if (drillAmount < 1) {
			notify({
				title: 'You\'re missing a drill'
			})
			return
		}
		const success = await globalThis.exports['glitch-minigames'].StartPlasmaDrilling(5)
		if (!success) return

		vehicleDoorsBroken[side] = true

		if (!vehicleDoorsBroken['left'] || !vehicleDoorsBroken['right']) return

		const entity = client.entity.handle(netId)
		SetVehicleDoorOpen(entity, 2, false, false)
		SetVehicleDoorOpen(entity, 3, false, false)

		globalThis.exports.ox_target.removeEntity(netId, `${side}-door`)
	}

	globalThis.exports.ox_target.addEntity(netId, [
		{
			name: 'left-door',
			label: 'Break Left Door',
			bones: 'door_dside_r',
			canInteract: () => team,
			onSelect: async () => {
				breakDoor('left')
			}
		},
		{
			name: 'right-door',
			label: 'Break Right Door',
			bones: 'door_pside_r',
			canInteract: () => team,
			onSelect: async () => breakDoor('right')
		},
		{
			name: 'take-money',
			label: 'Take Money',
			bones: ['door_pside_r', 'door_dside_r'],
			canInteract: () => team && vehicleDoorsBroken['left'] && vehicleDoorsBroken['right'],
			onSelect: async () => {
				const res = await progressBar({
					label: 'Taking money',
					duration: 10000,
					canCancel: false,
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
		
				vehicleDoorsBroken['left'] = false
				vehicleDoorsBroken['right'] = false
				clearTick(blipTick)
				globalThis.exports.ox_target.removeEntity(netId, 'take-money')
		
				emitNet('lenix:server:robbery:takemoney')
			}
		},
	])
})

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

setImmediate(async () => {
	const entity = await createPed('a_m_m_prolhost_01', ...PED_COORDS, true)
	if (!entity) return

	globalThis.exports.ox_target.addLocalEntity(entity, {
		label: 'Robbery Mission',
		onSelect: () => {
			showContext('robbery-mission')
		}
	})
})

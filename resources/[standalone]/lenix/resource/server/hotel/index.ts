import { addCommand } from "@overextended/ox_lib/server"
import { oxmysql } from "@overextended/oxmysql"
import { HOTEL_ROOMS, HOTEL_SAFES } from "common/hotel"
import type { Vector4 } from "types"

const getTakenRooms = async () => {
	const response = await oxmysql.query<{ room: number }[]>('SELECT `room` FROM `lenix`')
	if (!response) return

	return response.map(rooms => rooms.room)
}

const generateRoomId = async () => {
	const roomsTaken = await getTakenRooms()
	if (!roomsTaken) return

	const availableRooms = HOTEL_ROOMS.filter(room => !roomsTaken.includes(room));
	return Math.floor(Math.random() * availableRooms.length)
}

on('ox:createdCharacter', async (playerId, userId, charId) => {
	const roomId = await generateRoomId()
	if (!roomId) throw new Error(`Failed to create a room for charId<${charId}>`)
	const stashCoords = HOTEL_SAFES[roomId]?.coords
	if (!stashCoords) throw new Error(`Failed to create a room, expected 'vector4', got ${stashCoords}, type:${typeof stashCoords}`)

	const { id, label, slots, weight, owner, coords }: {
		id: string | number
		label: string
		slots: number
		weight: number
		owner: `charId:${number}`
		coords: Vector4
	} = {
		id: roomId,
		label: 'Room Stash',
		slots: 100,
		weight: 100000,
		owner: `charId:${charId}`,
		coords: stashCoords
	}

	globalThis.exports.ox_inventory.RegisterStash(id, label, slots, weight, owner, null, coords)
	const [success, response] = globalThis.exports.ox_inventory.AddItem(playerId, 'hotel_keycard', 1, { type: `Room${roomId}` })
	if (!success) throw new Error(`Failed to give hotel room key to charId<${charId}>, reason: ${response}`)

	console.debug(playerId, userId, charId)
})

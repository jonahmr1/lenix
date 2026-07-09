import { sleep } from '@overextended/core/utils'
import { oxmysql } from '@overextended/oxmysql'
import { HOTEL_ROOMS, HOTEL_SAFES } from 'common/hotel'

const getTakenRooms = async () => {
	const response = await oxmysql.query<{ room: number }[]>('SELECT `hotel_room` FROM `lenix`')
	if (!response) return

	return response.map(rooms => rooms.room)
}

const generateRoomId = async () => {
	const roomsTaken = await getTakenRooms()
	if (!roomsTaken) return

	const availableRooms = HOTEL_ROOMS.filter(room => !roomsTaken.includes(room))
	return availableRooms[Math.floor(Math.random() * availableRooms.length)]
}

on('ox:createdCharacter', async (playerId: number, _userId: number, charId: number) => {
	const roomId = await generateRoomId()
	if (!roomId) throw new Error(`Failed to create a room for charId<${charId}>`)
	const stashCoords = HOTEL_SAFES[roomId]?.coords
	if (!stashCoords) throw new Error(`Failed to create a room, expected 'vector4', got ${stashCoords}}`)

	const {
		id,
		label,
		slots,
		weight,
		coords,
	}: {
		id: string
		label: string
		slots: number
		weight: number
		coords: { x: number; y: number; z: number }
	} = {
		id: `room:${roomId}`,
		label: 'Room Stash',
		slots: 100,
		weight: 100000,
		coords: { x: stashCoords[0], y: stashCoords[1], z: stashCoords[2] },
	}

	await sleep(2000)
	globalThis.exports.ox_inventory.RegisterStash(id, label, slots, weight, null, {}, coords)
	const [success, response] = globalThis.exports.ox_inventory.AddItem(playerId, 'hotel_keycard', 1, {
		type: `Room ${roomId}`,
	})
	if (!success) throw new Error(`Failed to give hotel room key to charId<${charId}>, reason: ${response}`)

	const [success1, response1] = globalThis.exports.ox_inventory.AddItem(playerId, 'money', 5000)
	if (!success1) throw new Error(`Failed to give money to charId<${charId}>, reason: ${response1}`)
	
})


import { onPromise } from "@trippler/tr_lib/server"
import { trace } from "@trippler/tr_lib/shared"

const bridge = {
	getPlayerData: (source: number) => {
		const playerData = exports['qb-core'].GetCoreObject().Functions.GetPlayer(source).PlayerData
		return { license: playerData.license as string, citizenid: playerData.citizenid as string }
	},
	SQL_Register: async (source: number, model: string, hash: string, mods: string, plate: string) => {
		const coreReady = GetResourceState('qb-core') == 'started'
		const SQL_Ready = GetResourceState('oxmysql') == 'started'
		if (!coreReady || !SQL_Ready) {
			trace('qb-core or oxmysql is not started, cannot register vehicle')
			return false
		}

		const playerData = bridge.getPlayerData(source)
		const response = await exports.oxmysql.insert_async('INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state) VALUES (?, ?, ?, ?, ?, ?, ?)', [
			playerData.license,
			playerData.citizenid,
			model,
			hash,
			mods,
			plate,
			0
		])
		return response
	}
}

onPromise('registerCreatedVehicle', async (source, model, hash, mods, plate) => {
	const response = await bridge.SQL_Register(source, model, hash, mods, plate)
	if (!response) {
		trace('Failed to register the vehicle for the player with the id of: ' + source)
		return false
	}
	return true
})
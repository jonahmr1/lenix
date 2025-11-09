async function insertSQL(mods, vehicle, plate, src) {
    const source = src
    let Player = await QBCore.Functions.GetPlayer(source)
    const response = await exports.oxmysql.insert_async('INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state) VALUES (?, ?, ?, ?, ?, ?, ?)', [
        Player.PlayerData.license,
        Player.PlayerData.citizenid,
        vehicle.model,
        vehicle.hash,
        JSON.stringify(mods),
        plate,
        0
    ])
    return response
}
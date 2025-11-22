let Bridge = {}

Bridge.getPlayerData = (source) => {
  const playerData = exports['qb-core'].GetCoreObject().Functions.GetPlayer(source).PlayerData
  return { license: playerData.license, citizenid: playerData.citizenid }
}

Bridge.SQL_Register = async (source, model, hash, mods, plate) => {
  const coreReady = GetResourceState('qb-core') == 'started'
  const SQL_Ready = GetResourceState('oxmysql') == 'started'
  if (!coreReady || !SQL_Ready) {
    lib.console.trace('qb-core or oxmysql is not started, cannot register vehicle')
    return
  }

  const playerData = Bridge.getPlayerData(source)
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
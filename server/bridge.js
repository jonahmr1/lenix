let Bridge = {}

Bridge.getPlayerData = function(source) {
  const playerData = QBCore.Functions.GetPlayer(source).PlayerData
  return { license: playerData.license, citizenid: playerData.citizenid }
}

Bridge.removeCash = function(source, amount) {
  QBCore.Functions.GetPlayer(source).Functions.RemoveMoney('cash', amount)
}

Bridge.notify = function(source, message, type) {
  emitNet('QBCore:Notify', source, message, type)
}

Bridge.giveKeys = function(plate) {
  emitNet('qb-vehiclekeys:server:AcquireVehicleKeys', plate)
}
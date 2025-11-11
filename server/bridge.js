let Bridge = {}

Bridge.getPlayerData = function(source) {
  return QBCore.Functions.GetPlayer(source).PlayerData
}

Bridge.removeMoney = function(source, moneyType, amount) {
  QBCore.Functions.GetPlayer(source).Functions.RemoveMoney(moneyType, amount)
}

Bridge.notify = function(source, message, type) {
  emitNet('QBCore:Notify', source, message, type)
}

Bridge.giveKeys = function(plate) {
  emitNet('qb-vehiclekeys:server:AcquireVehicleKeys', plate)
}
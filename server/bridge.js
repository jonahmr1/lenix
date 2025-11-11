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

Bridge.getPlayerJob = function(source) {
  const job = QBCore.Functions.GetPlayer(source).PlayerData.job
  const gradeLevel = QBCore.Functions.GetPlayer(source).PlayerData.job.grade.level
  return { name: job, grade: gradeLevel}
}

Bridge.getPlayerGang = function(source) {
  const gang = QBCore.Functions.GetPlayer(source).PlayerData.gang
  const gradeLevel = QBCore.Functions.GetPlayer(source).PlayerData.gang.grade.level
  return { name: gang, grade: gradeLevel}
}
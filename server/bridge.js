let Bridge = {}

Bridge.getPlayerMoney = function(source) {
  const playerData = exports.qbx_core.GetPlayer(source).PlayerData
  return { money: playerData.money }
}

Bridge.removeCash = function(source, amount) {
  QBCore.Functions.GetPlayer(source).Functions.RemoveMoney('cash', amount)
}

Bridge.notify = function(source, message, type) {
  emitNet('QBCore:Notify', source, message, type)
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
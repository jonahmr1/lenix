let PlayerJob = {}
let netIdsRequested = []
const Vehicles = exports['qb-core'].GetSharedVehicles()

onNet('QBCore:Client:OnPlayerLoaded', function() {
    init()
})

onNet('QBCore:Client:OnJobUpdate', function(UpdatedData) {
    PlayerJob = UpdatedData
})
function init() {
    PlayerJob = QBCore.Functions.GetPlayerData().job
    createPeds()
    createInteractions()
}
init() // for dev mode only
let NetIdsRequested = []
let PlayerJob = {}
function Initialization(currentJob) {
  PlayerJob = currentJob
  createPeds()
  createInteractions()
}

function IsZoneFree(zone) {
  const response = lib.isZoneClear(zone, 2, [ PlayerPedId() ])
  return response
}
Initialization(Bridge.getPlayerJob()) // for dev mode only
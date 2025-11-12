let NetIdsRequested = []
let PlayerJob = {}
function Initialization(currentJob) {
  PlayerJob = currentJob
  createPeds()
  createInteractions()
}

function IsZoneFree(zone) {
  const response = lib.isZoneClear({ coords: zone, radius: 2 })
  return response
}
Initialization(Bridge.getPlayerJob()) // for dev mode only
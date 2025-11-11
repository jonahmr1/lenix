let NetIdsRequested = []
let PlayerJob = {}
function Initialization(currentJob) {
    PlayerJob = currentJob
    createPeds()
    createInteractions()
}

Initialization(Bridge.getPlayerJob()) // for dev mode only

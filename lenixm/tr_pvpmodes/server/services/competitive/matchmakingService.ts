let waitingRoom: number[] = []

const homeLocation = [-353.7528, -822.3127, 31.5012, 0.9013]
const awayLocation = [-343.9194, -706.1902, 32.6280, 284.1532]

const shutDownDashboard = (source: number) => {
  emitNet('tr_pvpmodes/client/competitive/shutDownDashboard', source)
}

const startNewSession = (homePlayer: number, awayPlayer: number) => {
  SetEntityCoords(GetPlayerPed(homePlayer.toString()), homeLocation[0], homeLocation[1], homeLocation[2], true, false, true, false)
  SetEntityCoords(GetPlayerPed(awayPlayer.toString()), awayLocation[0], awayLocation[1], awayLocation[2], true, false, true, false)
  SetEntityHeading(GetPlayerPed(homePlayer.toString()), homeLocation[3])
  SetEntityHeading(GetPlayerPed(awayPlayer.toString()), awayLocation[3])
}

onNet('tr_pvpmodes/server/competitive/startMatchmaking', () => {
  console.log(`${source} joined the waiting room.`)
  waitingRoom.push(source)
})

onNet('tr_pvpmodes/server/competitive/stopMatchmaking', () => {
  console.log(`${source} left the waiting room.`)
  waitingRoom = waitingRoom.filter(player => player !== source) 
})

setInterval(() => {
  if (waitingRoom.length >= 2) {
    console.log('Starting new session... for ', waitingRoom[0], 'and', waitingRoom[1])
    startNewSession(waitingRoom[0], waitingRoom[1])
    shutDownDashboard(waitingRoom[0])
    shutDownDashboard(waitingRoom[1])
    waitingRoom = waitingRoom.filter(player => player !== waitingRoom[0] && player !== waitingRoom[1])
  }
}, 5000)
import { trace } from '@trippler/tr_lib/shared'
import { bridge } from '../api'
import { config, settings } from '../../shared/constants'
import { tableFiller } from '../../shared/utils'
import { onPromise } from '@trippler/tr_lib/server'

export let isPreviewSessionBusy = false

const isPlayerBelongToPositionOf = (targetedPosition: unknown, playerPosition: unknown) => {
  if (targetedPosition == playerPosition) return true
  return false
}

const isPlayerEligableToPositionOf = (targetedGrade: unknown, playerGrade: unknown) => {
  if (targetedGrade <= playerGrade) return true
  return false
}

const isPlayerBelongToPositions = (source: unknown, targetedPositions: unknown) => {
  let isPlayerBelongToJob = false,
    isPlayerBelongToGang = false
  if (targetedPositions?.job) {
    const targetedJob = Object.entries(targetedPositions?.job)[0][0]
    const playerJob = bridge.getPlayerJob(source).name
    isPlayerBelongToJob = isPlayerBelongToPositionOf(targetedJob, playerJob)
  }
  
  if (targetedPositions?.gang) {
    const targetedGang = Object.entries(targetedPositions?.gang)[0][0]
    const playerGang = bridge.getPlayerGang(source).name
    isPlayerBelongToGang = isPlayerBelongToPositionOf(targetedGang, playerGang)
  }
  if (!isPlayerBelongToJob || !isPlayerBelongToGang) return false; 

  return true
}

const isPlayerGradeEligable = (source: unknown, targetedJob: unknown, targetedGang: unknown) => {
  let isPlayerEligableToJob = false,
    isPlayerEligableToGang = false
  if (targetedJob) {
    const targetedJobTable = Object.entries(targetedJob)[0][1]
    const targetedJobGrade = Object.values(targetedJobTable)[0]
    const playerJobGrade = bridge.getPlayerJob(source).grade
    isPlayerEligableToJob = isPlayerEligableToPositionOf(targetedJobGrade, playerJobGrade)
  }
  if (targetedGang) {
    const targetedGangTable = Object.entries(targetedGang)[0][1]
    const targetedGangGrade = Object.values(targetedGangTable)[0]
    const playerGangGrade = bridge.getPlayerGang(source).grade
    isPlayerEligableToGang = isPlayerEligableToPositionOf(targetedGangGrade, playerGangGrade)
  }

  if (isPlayerEligableToJob || isPlayerEligableToGang) return true; 

  return false
}

const playerInPositionOf = (source: unknown, targetedPositions: unknown) => {
  if (isPlayerBelongToPositions(source, targetedPositions)) return true;

  if (isPlayerGradeEligable(source, targetedPositions)) return true;

  return false
}

onPromise('isPlayerInAllowList', (source, allowedTargets) => {
  if (Object.keys(allowedTargets).length === 0) return true
  return playerInPositionOf(source, allowedTargets)
})

onPromise('isPlayerNotInDisallowedList', (source, disallowedTargets) => {
  if (Object.keys(disallowedTargets).length === 0) return true
  return !playerInPositionOf(source, disallowedTargets)
})

const generatePlate = (plateArray: unknown) => {
  const plateString = plateArray[0]
  const plateMinimumInteger = plateArray[1]
  const plateMaximumInteger = plateArray[2]
  return `${plateString}${Math.floor(Math.random() * (plateMaximumInteger - plateMinimumInteger + 1)) + plateMinimumInteger}`
}

const spawnBoughtVehicle = async (source: unknown, isRegisterable: unknown, systemKey: unknown, configIndex: unknown) => {
  const selectedConfig = settings[systemKey].ITEM
  const proccessedItems = tableFiller(config._DEFAULT, config[selectedConfig][configIndex])
  const [handle, netId] = await createSingleVehicle(source, {
    hash: GetHashKey(config[selectedConfig][configIndex].vehicle),
    coords: settings[systemKey].VEHICLES.spawn,
    preCreate: true,
    plate: generatePlate(proccessedItems.plate),
    warp: {
      entityNetId: await lib.awaitInstanceExisting(GetPlayerPed(source))[1],
      seat: -1
    },
    giveKey: true,
    setFuelAmount: 100,
    engine: {
      instantly: true,
      disableAutoStart: true
    },
    customize: {
      style: [proccessedItems.style[0], proccessedItems.style[1], proccessedItems.style[2]],
      livery: proccessedItems.style.livery
    },
    register: isRegisterable
  })
  if (netId && handle) {
    if (isRegisterable) {
      return netId
    } else {
      emitNet('lenix_vehicle:client:addReturnOption', source, netId, proccessedItems)
    }
    return netId
  } else {
    trace('Vehicle net id could not be found')
  }
  return false
}

export const setPreviewSessionBusy = (status: unknown) => {
  isPreviewSessionBusy = status
  if (isPreviewSessionBusy) {
    on("playerDropped", () => {
      if (source === global.source) {
        isPreviewSessionBusy = false
      }
    })
  }
}

export const proccessVehicleRegisteration = async (systemKey: unknown, configIndex: unknown) => {
  const src = source
  const getPlayerMoney = bridge.getPlayerMoney(src)
  const selectedConfig = settings[systemKey].ITEM
  const proccessedItems = tableFiller(config._DEFAULT, config[selectedConfig][configIndex])
  const isRegisterable = proccessedItems.registerable

  if (isRegisterable) {
    if (getPlayerMoney.money.cash >= (proccessedItems.price)) {
      const netId = await spawnBoughtVehicle(src, true, systemKey, configIndex)
      if (netId) {
        bridge.removeCash(src, proccessedItems.price)
        bridge.notify(src, 'Vehicle Successfully Bought', 'success')
      } else {
        trace('Failed to sell the car to the player with the id of: ' + src)
      }
    } else {
      bridge.notify(src, 'You Don\'t Have Enough Money !', 'error')
    }
  } else {
    const netId = await spawnBoughtVehicle(src, false, systemKey, configIndex)
    if (netId) {
      bridge.notify(src, 'Vehicle Successfully took out', 'success')
    } else {
      trace('Failed to take the car out to the player with the id of: ' + src)
    }
  }
}
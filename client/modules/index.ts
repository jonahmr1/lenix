import { createSinglePed, destroyCreatedPed } from '@trippler/tr_kit/client'
import { settings } from '../../shared/constants'
import { bridge } from '../api'
import lib from '@communityox/ox_lib/client'
import { getState, setState } from '../states'
import { tableFiller } from '../../shared/utils'

export const createPeds = () => {
  for (const [key, value] of Object.entries(settings)) {
    if (key === "_DEFAULT") continue
    const fallbackSettings = settings._DEFAULT.PEDS
    value.PEDS.peds.forEach(async pedElement => {
      const settings = tableFiller(fallbackSettings, pedElement)
      const [pedHandle, pedNetId] = await createSinglePed(settings)
      on('onResourceStop', (resourceName: string) => {
        if (resourceName == GetCurrentResourceName()) destroyCreatedPed(pedNetId)
      })
    })
  }
}

export const createInteractions = () => {
  for (const [key, value] of Object.entries(settings)) {
    if (key === "_DEFAULT") continue
    for (const pedElement of value.PEDS.peds) {
      const zoneName = `${'lenix_vehicles'}_${key}_${pedElement.coords[0]}_${pedElement.coords[1]}_${pedElement.coords[2]}`
      const interactions = tableFiller(settings._DEFAULT.INTERACTIONS, settings[key].INTERACTIONS)
      bridge.target(zoneName, pedElement, interactions, key)
    }
  }
}

export const returnVehicle = async () => {
  const closestVehicleHandle = await lib.closestVehicle(PlayerPedId(), 10.0)
  const [closestVehicleNetId, _] = await lib.awaitNetworkExisting(null, closestVehicleHandle)
  const response = await destroyCreatedPed(closestVehicleNetId)
  if (!response) {
    bridge.notify('Failed to return the vehicle, please try again later', 'error')
    return
  }
  const newNetIdsRequested = getState.netIdsRequested.splice(getState.netIdsRequested.indexOf(closestVehicleNetId), 1)
  setState.netIdsRequested(newNetIdsRequested)
  bridge.notify('Vehicle returned successfully', 'success')
}
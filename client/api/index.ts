import { Initialization } from ".."
import { returnVehicle } from "../modules"
import { getState, setState } from "../states"
import lib from '@communityox/ox_lib/client'

export const qb = exports['qb-core'].GetCoreObject()

export const bridge = {
  getVehicles: (key: unknown) => exports.qbx_core.GetVehiclesByName(key),
  getPlayerJob: () => {
    const playerJob = qb.Functions.GetPlayerData().job
    return { name: playerJob.name, gradeLevel: playerJob.grade.level }
  },
  getPlayerGang: () => {
    const playerGang = qb.Functions.GetPlayerData().gang
    return { name: playerGang.name, gradeLevel: playerGang.grade.level }
  },
  notify: (message: unknown, type: unknown) => exports.qbx_core.Notify(message, type),
  target: (zoneName: unknown, pedElement: unknown, interactions: unknown, key: unknown) => {
    exports.ox_target.addBoxZone({
      coords: {
        x: pedElement.coords[0],
        y: pedElement.coords[1],
        z: pedElement.coords[2]
      },
      name: zoneName,
      size: {
        x: 3.45,
        y: 3.35,
        z: 2.0
      },
      rotation: pedElement.coords[3],
      debug: interactions.debug,
      options: [
        {
          label: interactions.take.label,
          groups: (interactions.targets?.job || interactions.targets?.gang) ? [
            interactions.targets?.job,
            interactions.targets?.gang
          ] : undefined,
          distance: interactions.take.distance,
          onSelect: () => {
            Menu.main(key)
          }
        },
        {
          label: interactions.return.label,
          groups: (interactions.targets?.job || interactions.targets?.gang) ? [
            interactions.targets?.job,
            interactions.targets?.gang
          ] : undefined,
          distance: interactions.take.distance,
          canInteract: () => {
            return getState.netIdsRequested.length !== 0
          },
          onSelect: async () => {
            await returnVehicle()
          }
        }
      ]
    })
  },
  menu: {
    open: (main: unknown, options: unknown) => {
      const mappedOptions = {}
      for (let i = 1; i <= options.length; i++) {
        mappedOptions.push({
          title: options[i].title,
          description: options[i].description,
          icon: options[i].icon,
          disabled: options[i].restricted,
          onSelect: () => options[i].onClick(),
        })
      }

      lib.registerContext({
        id: main.id,
        title: main.header,
        options: mappedOptions
      })
      lib.showContext(main.id)
    },
    close: () => lib.hideContext(false)
  },
  drawText: {
    show: () => exports['qb-core'].DrawText('⇽', 'right'),
    hide: () => exports['qb-core'].HideText()
  }
}

onNet('QBCore:Client:OnPlayerLoaded', () => Initialization(bridge.getPlayerJob()))

onNet('QBCore:Client:OnJobUpdate', (UpdatedData: unknown) => setState.playerJob(UpdatedData))
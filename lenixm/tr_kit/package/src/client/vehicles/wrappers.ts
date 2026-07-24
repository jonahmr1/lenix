import { awaitInstanceExisting, requestModel, triggerPromise } from "@trippler/tr_lib/client"
import { CreateSingleVehicle } from "../../shared"
import { fatal, trace } from "@trippler/tr_lib/shared"
import { destroyCreatedVehicle } from "."

const bridge = {
  giveKey: (plate: string) => {
    emitNet('qb-vehiclekeys:server:AcquireVehicleKeys', plate)
  },
  setFuel: (handle: number, fuel: number) => {
    const entity = Entity(handle)
    if (entity) {
      entity.state.fuel = fuel
    }
  }
}

const preCreateVehicle = (netId: number) => {
  const entity = NetworkGetEntityFromNetworkId(netId)

  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      SetEntityAlpha(entity, 51, false)
      setTimeout(() => {
        SetEntityAlpha(entity, 102, false)
      }, 100)
    }, i * 200)
  }

  setTimeout(() => {
    ResetEntityAlpha(entity)
  }, 2000)
}

export const spawnVehicleEntity = async (entityHash: number, spawnCoords: number[]) => {
  const response = await requestModel(entityHash, 1000)
  if (!response) fatal('failed to load the model with hash of: ' + entityHash)
  
  const entityHandle = CreateVehicle(entityHash, spawnCoords[0], spawnCoords[1], spawnCoords[2], spawnCoords[3], true, true)
  
  const [newEntityHandle, entityNetId] = await awaitInstanceExisting(entityHandle)
  if (!entityNetId) return
  return [newEntityHandle, entityNetId]
}

export const applySettings = async ({
  warp,
  preCreate,
  handle,
  plate,
  giveKey,
  fuelAmount,
  engine,
  customize
}: Partial<CreateSingleVehicle> & { handle: number }) => {
  const [entityHandle, existingNetId] = await awaitInstanceExisting(handle, warp?.netId)
  plate && SetVehicleNumberPlateText(handle, plate)
  plate && giveKey && bridge.giveKey(plate)
  fuelAmount && bridge.setFuel(handle, fuelAmount)
  engine && SetVehicleEngineOn(handle, true, engine.instantly, engine.disableAutoStart)
  if (preCreate && existingNetId) {
    preCreateVehicle(existingNetId)	
  }
  if (warp && entityHandle) {
    TaskWarpPedIntoVehicle(entityHandle, handle, warp.seat)
  }
  if (customize) {
    SetVehicleCustomPrimaryColour(handle, customize[0], customize[1], customize[2])
    SetVehicleCustomSecondaryColour(handle, customize[0], customize[1], customize[2])
    if (customize[3].livery) {
      SetVehicleLivery(handle, customize[3].livery)
      SetVehicleMod(handle, 48, customize[3].livery, false)
    }
  }
}


export const registerVehicle = async (entityModel: string, entityHash: number, vehiclePlate: string, entityNetId: number) => {
  const response = await triggerPromise('registerCreatedVehicle', null, entityModel, entityHash, null, vehiclePlate)
  if (!response) {
    trace('Failed to register the vehicle')
    destroyCreatedVehicle(entityNetId)
    return [false, false]
  }
  return true
}
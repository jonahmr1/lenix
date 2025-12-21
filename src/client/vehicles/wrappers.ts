import { awaitInstanceExisting } from "@trippler/tr_lib/shared"
import { CreateSingleVehicle } from "../../shared"
import { fatal, requestModel } from "@trippler/tr_lib/client"

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

export const spawnVehicleEntity = async (entityHash: number, spawnCoords: [number, number, number, number]) => {
  const response = await requestModel(entityHash, 1000)
  if (!response) fatal('failed to load the model with hash of: ' + hash)
  
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
  setFuelAmount,
  engine,
  customize
}: CreateSingleVehicle & { handle: number }) => {
  const [pedHandle, existingNetId] = await awaitInstanceExisting(null, warp.entityNetId)
  preCreate && preCreateVehicle(existingNetId)	
  plate && SetVehicleNumberPlateText(handle, plate)

  warp && TaskWarpPedIntoVehicle(pedHandle, handle, warp.seat)
  plate && giveKey && bridge.giveKey(plate)
    setFuelAmount && bridge.setFuel(handle, setFuelAmount)
  engine && SetVehicleEngineOn(handle, true, engine.instantly, engine.disableAutoStart)
  if (customize) {
    SetVehicleCustomPrimaryColour(handle, customize[0], customize[1], customize[2])
    SetVehicleCustomSecondaryColour(handle, customize[0], customize[1], customize[2])
    SetVehicleLivery(handle, customize[3].livery)
    SetVehicleMod(handle, 48, customize[3].livery, false)
  }
}
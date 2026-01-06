import { createBlip, createSinglePed, destroyCreatedPed } from "@trippler/tr_kit/client"
import { styleConfig } from "../../shared/constants"
import { addTarget } from "../api"

setImmediate(async () => {
  addTarget()
  createBlip(styleConfig.ui.coords, 1)

  const [_pedHandle, pedNetId] = await createSinglePed({
    hash: GetHashKey('ig_talcc'),
    coords: styleConfig.ui.coords,
    scenario: {
      name: 'WORLD_HUMAN_LEANING', 
      timeToLeave: 1000, 
      playIntroClip: false
    }
  })
  on('onResourceStop', (resourceName: string) => {
    if (GetCurrentResourceName() === resourceName) destroyCreatedPed(pedNetId)
  })
})
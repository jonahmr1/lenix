import { openJobCenter, closeJobCenter } from "../modules"
import { styleConfig } from "../../shared/constants"

export const addTarget = () => {
  return exports.ox_target.addBoxZone({
    coords: styleConfig.ui.coords,
    name: 'jobcenter',
    size: [1, 1, 1],
    rotation: 0,
    debug: false,
    options: [
      {
        label: 'Search For A Job',
        onSelect: exports.lenix_jobcenter.openJobCenter
      }
    ]
  })
}

exports('openJobCenter', openJobCenter)
exports('closeJobCenter', closeJobCenter)
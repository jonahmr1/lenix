import { useButton } from "@trippler/tr_kit/nui"
import unavailableNotice from "../../../../../../components/competitive/dashboard/serviceUnavailable"

useButton({
  parent: "player-details",
  content: "🌟 | 3000/4500",
  size: "base",
  type: "primary",
  onClick: () => {
    unavailableNotice()
  }
})
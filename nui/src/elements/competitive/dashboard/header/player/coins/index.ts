import { useButton } from "@trippler/tr_kit/nui"
import unavailableNotice from "../../../../../../../../nui/src/components/competitive/dashboard/serviceUnavailable"

useButton({
  parent: "player-details",
  content: "⭐ | 150",
  size: "base",
  type: "soft",
  onClick: () => {
    unavailableNotice()
  }
})
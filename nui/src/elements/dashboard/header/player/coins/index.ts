import { useButton } from "@trippler/tr_kit/nui"
import unavailableNotice from "../../../../../components/dashboard/serviceUnavailable"

useButton({
  parent: "player-details",
  content: "⭐ | 150",
  size: "base",
  type: "soft",
  onClick: () => {
    unavailableNotice()
  }
})
import { useButton } from "@trippler/tr_kit/web"
import { useFriendsPanel } from "../../../../../modules/dashboard/friendsPanel"

useButton({
  parent: "player-details",
  id: "friendsButton",
  className: "w-[10%] h-[80%] bg-blue-700 flex items-center justify-center",
  size: "base",
  content: "👥 | 0",
  type: "secondary",
  onClick: () => {
    useFriendsPanel()
  }
})
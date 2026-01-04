import { useDiv, useButton} from "@trippler/tr_kit/nui"
import unavailableNotice from "../../../../../components/dashboard/serviceUnavailable"

useButton({
  parent: "player-details",
  id: "player-card",
  style: "w-[35%] h-full bg-gray-700 flex justify-center items-center rounded-md overflow-hidden",
  onClick: () => unavailableNotice()
})

const avatarElement = useDiv({
  parent: "player-card",
  id: "player-avatar",
  style: "w-full h-full bg-stone-800 flex-[1] flex justify-center items-center p-1"
})

useDiv({
  parent: "player-card",
  id: "player-info",
  style: "w-full h-full hover:bg-gray-600 flex flex-[4] px-2"
})

const nameElement = useDiv({
  parent: "player-info",
  style: "h-full text-white flex items-center"
})

export const updatePlayerCard = (name: string, avatar: string) => {
  avatarElement.innerHTML = `<img src='${avatar}' class='rounded-sm'>`
  nameElement.innerHTML = name
}
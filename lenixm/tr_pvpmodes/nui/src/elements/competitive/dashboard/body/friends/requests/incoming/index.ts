import { useDiv, useButton } from "@trippler/tr_kit/nui"
import playerDetails from "../../../../../../../modules/competitive/dashboard/playerDetails"
import { removeIncomingRequest } from "../../../../../../../../../nui/src/api/competitive/dashboard"
import { triggerNuiCallback } from "@trippler/tr_lib/nui"
import { GetIncomingFriends } from "../../../../../../../../../shared/types/competitive"
import { acceptFriendship } from "../../../../../../../modules/competitive/dashboard"

useDiv({
  parent: "friendsRequests",
  id: "incomingRequests",
  style: "w-full h-full overflow-auto [scrollbar-width:none]"
})

let currentIncoming = document.getElementById('incomingRequests')
let incomingRequests: HTMLDivElement[] = []

const addNewIncomingRequest = async (index: number, identity: number): Promise<void> => {
  const user = await new playerDetails().getUserDetails(identity)

  const request = useDiv({
    parent: "incomingRequests",
    id: `incoming-item-${index}`,
    style: "flex items-center justify-between hover:bg-stone-600 text-sm py-2"
  })
  useDiv({
    parent: `incoming-item-${index}`,
    style: "w-[75%] flex items-center justify-start",
    content: `
      <img src="${user.avatar}" class="w-[20%]" />
      <div class="ml-2 flex flex-col">
        <p class="text-base font-semibold">${user.name}</p>
      </div>
    `
  })
  useButton({
    parent: `incoming-item-${index}`,
    style: "w-[25%] h-[12.5%] hover:bg-blue-500 flex items-center justify-center",
    content: '✅',
    onClick: async () => {
      const response = await removeIncomingRequest(identity)
      if (!response) return
      acceptFriendship(identity)
      request.remove()
      incomingRequests.splice(index, 1)
    }
  })
  useButton({
    parent: `incoming-item-${index}`,
    style: "w-[25%] h-[12.5%] hover:bg-blue-500 flex items-center justify-center",
    content: '❌',
    onClick: async () => {
      const response = await removeIncomingRequest(identity)
      if (!response) return
      request.remove()
      incomingRequests.splice(index, 1)
    }
  })
  incomingRequests.push(request)
  currentIncoming?.appendChild(request)
}

setTimeout(async () => {
  const incoming = await triggerNuiCallback<GetIncomingFriends>('competitive/dashboard/getIncomingFriends')
  incoming?.forEach((identity, index: number) => addNewIncomingRequest(index, identity))
}, 0)
import { useDiv, useButton} from "@trippler/tr_kit/nui"
import playerDetails from "../../../../../../../modules/competitive/dashboard/playerDetails"
import { triggerNuiCallback } from "@trippler/tr_lib/nui"
import { CancelOutgoingFriendship, GetOutgoingFriends } from "../../../../../../../../../shared/types/competitive"

useDiv({
  parent: "friendsRequests",
  id: "outgoingRequests",
  style: "w-full hidden h-full overflow-auto [scrollbar-width:none]"
})

let currentOutgoing = document.getElementById('outgoingRequests')
let outgoingRequests: HTMLDivElement[] = []

const addNewOutgoingRequest = async (index: number, identity: number): Promise<void> => {
  const user = await new playerDetails().getUserDetails(identity)
  
  const request = useDiv({
    parent: "outgoingRequests",
    id: `outgoing-item-${index}`,
    style: "flex items-center justify-between hover:bg-stone-600 text-sm py-1"
  })
  useDiv({
    parent: `outgoing-item-${index}`,
    style: "w-[75%] flex items-center justify-start",
    content: `
      <img src=${user.avatar} class="w-[20%]" />
      <div class="ml-2 flex flex-col">
        <p class="text-base font-semibold">${user.name}</p>
      </div>
    `
  })
  useButton({
    parent: `outgoing-item-${index}`,
    style: "w-[25%] h-[12.5%] hover:bg-blue-500 flex items-center justify-center",
    content: '🚫',
    onClick: async () => {
      const response = await triggerNuiCallback<CancelOutgoingFriendship>('dashboard/cancelOutgoingFriendship', { identity })
      if (!response) return
      request.remove()
      outgoingRequests.splice(index, 1)
    }
  })
  outgoingRequests.push(request)
  currentOutgoing?.appendChild(request)
}

setTimeout(async () => {
  const outgoing = await triggerNuiCallback<GetOutgoingFriends>('dashboard/getOutgoingFriends')
  outgoing.forEach((identity, index: number) => addNewOutgoingRequest(index, identity))
}, 0)
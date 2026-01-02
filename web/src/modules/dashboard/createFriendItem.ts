import { useButton, useDiv } from "@trippler/tr_kit/web"
import { removePlayerFriendship } from "../../api/dashboard"
import playerDetails from "./playerDetails"
import { triggerNuiCallback } from "@trippler/tr_lib/web"
import { RemovePlayerFriendship } from "../../../../shared/types"

let currentItems = document.getElementById('friendsItems') as HTMLDivElement
let friendsItems = 0

export default async (identity: number): Promise<void> => {
  document.getElementById('noFriendsFound')?.remove()
  const user = await new playerDetails().getUserDetails(identity)

  const friend = useDiv({
    parent: "friendsItems",
    id: `friend-item-${friendsItems}`,
    className: "flex items-center justify-between hover:bg-stone-600 text-sm py-4 px-2"
  })

  useDiv({
    parent: `friend-item-${friendsItems}`,
    className: "w-[75%] flex items-center justify-between",
    content: `
      <div class='w-[66%] flex items-center justify-start'>
        <img src="${user.avatar}" class="w-[20%]" />
        <div class="ml-2 flex flex-col">
          <p class="text-base font-semibold">${user.name}</p>
        </div>
      </div>
    `
  })
  
  const inviteBTN = useButton({
    parent: `friend-item-${friendsItems}`,
    className: "w-[16%] h-[12.5%] hover:bg-blue-500 flex items-center justify-center",
    content: '➕',
    onClick: () => {
      inviteBTN.innerText = '✅'
      setTimeout(() => {
        inviteBTN.innerText = '➕'
      }, 10000)
    }
  })
  
  useButton({
    parent: `friend-item-${friendsItems}`,
    className: "w-[16%] h-[12.5%] hover:bg-red-500 flex items-center justify-center",
    content: '➖',
    onClick: async () => {
      const response = await triggerNuiCallback<RemovePlayerFriendship>('dashboard/removePlayerFriendship', { identity })
      if (!response) return
      friend.remove()
      friendsItems--
    }
  })

  friendsItems++
  currentItems.appendChild(friend)
}
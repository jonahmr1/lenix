import { useButton, useDiv, useInput } from "@trippler/tr_kit/web"
import playerDetails from "../../../../../../modules/dashboard/playerDetails"
import { triggerNuiCallback } from "@trippler/tr_lib/web"
import { GetFriendablePlayers, SendUserFriendInvitation } from "../../../../../../../../shared/types"

const container = document.getElementById("playersSearchContainer")
const resultsBox = document.getElementById("playersResults")

let players: Awaited<ReturnType<playerDetails['getUserDetails']>>[]

const searchInput = useInput({
  parent: "playersSearchContainer",
  style: "w-full p-2 bg-stone-700 rounded text-white outline-none",
  placeholder: "Search players by: <name>",
  onJoin: async () => {
    const playerIds = await triggerNuiCallback<GetFriendablePlayers>('dashboard/getFriendablePlayers')

    players = await Promise.all(
      playerIds ?
        playerIds.map(async id => new playerDetails().getUserDetails(id))
      : []
    )
  },
  onChange: () => {
    const text = searchInput.value.toLowerCase().trim()
    resultsBox ? resultsBox.innerHTML = "" : null
    if (!text) return

    players.filter(p => p.name.toLowerCase().includes(text)).forEach(player =>
      {
        useDiv({
          parent: "playersResults",
          id: `player-item-${player.name}`,
          style: "flex items-center justify-between hover:bg-stone-600 text-sm py-1 px-2 rounded"
        })

        useButton({
          parent: `player-item-${player.name}`,
          content: `
            <img src="${player.avatar}" class="w-[40px] h-[40px] rounded mr-2">
            <span>${player.name}</span>
          `,
          style: "flex items-center text-white gap-2",
          onClick: () => event?.stopPropagation()
        })

        const btn = useButton({
          parent: `player-item-${player.name}`,
          content: '➕',
          type: 'primary',
          onClick: async (disable) => {
            btn.innerText = '💬'
            disable()
            btn.innerText = await triggerNuiCallback<SendUserFriendInvitation>('dashboard/sendUserFriendInvitation', { identity: player.id }) ? '✅' : '❌'
          }
        })
      })
  }
})

container?.prepend(searchInput)
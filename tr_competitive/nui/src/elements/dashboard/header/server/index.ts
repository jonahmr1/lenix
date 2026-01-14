import { useDiv } from "@trippler/tr_kit/nui"
import { triggerNuiCallback } from "@trippler/tr_lib/nui"
import { ServerProfile } from "../../../../../../shared/types"

(async () => {
  useDiv({
    parent: "header",
    id: "server-details",
    style: "w-[25%] h-[75%] flex items-center justify-start gap-1"
  })

  const profile = await triggerNuiCallback<ServerProfile>('dashboard/getServerProfile')

  useDiv({
    parent: "server-details",
    style: "w-[20%] h-full overflow-hidden flex items-center justify-center",
    content: `
    <img class='w-fit h-full rounded-md object-contain' src="${profile.avatar}">
    `
  })
  useDiv({
    parent: "server-details",
    style: "text-white font-bold text-2xl italic",
    content: profile.name
  })
})()
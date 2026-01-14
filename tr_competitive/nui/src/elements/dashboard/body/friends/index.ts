import { useDiv } from "@trippler/tr_kit/nui"
import('./list')
import('./requests')

useDiv({
  parent: "dashboard-body",
  id: "friends",
  style: "w-[20%] h-full relative overflow-hidden"
})

useDiv({
  parent: "friends",
  id: "friendsPanel",
  style: "w-full overflow-hidden blured-15 relative h-full absolute right-[-80%] hover:right-[0] transition-all"
})

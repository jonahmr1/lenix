import { useDiv } from "@trippler/tr_kit/web"
import('./list')
import('./requests')

useDiv({
  parent: "dashboard-body",
  id: "friends",
  className: "w-[20%] h-full relative overflow-hidden"
})

useDiv({
  parent: "friends",
  id: "friendsPanel",
  className: "w-full overflow-hidden blured-15 relative h-full absolute right-[-80%] hover:right-[0] transition-all"
})

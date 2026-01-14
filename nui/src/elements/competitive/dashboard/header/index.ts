import { useDiv } from "@trippler/tr_kit/nui"
import('./server')
import('./player')

useDiv({
  parent: "competitive-dashboard-root",
  id: "header",
  style: "w-full h-[8vh] blured-15 flex items-center justify-around gap-[10%]"
})
import { useDiv } from "@trippler/tr_kit/web"
import('./server')
import('./player')

useDiv({
  parent: "root",
  id: "header",
  className: "w-full h-[8vh] blured-15 flex items-center justify-around gap-[10%]"
})
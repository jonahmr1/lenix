import { useDiv } from "@trippler/tr_kit/web"
import('./card')
import('./coins')
import('./money')
import('./friends')

useDiv({
  parent: "header",
  id: "player-details",
  className: "w-[40%] h-[75%] flex items-center justify-around"
})
import { useDiv, useButton} from "@trippler/tr_kit/nui"
import updateRequestBlockState from "../../../../../modules/dashboard/collapseRequestBlock"
import { useRequestBlock } from "../../../../../modules/dashboard/friendsPanel"
import('./incoming')
import('./outgoing')

const friendsHeader = document.getElementById('friendsHeader')
friendsHeader?.addEventListener('click', () => {
  updateRequestBlockState(true)
})

useDiv({
  parent: "friendsPanel",
  id: "friendsRequests",
  style: "w-full -bottom-[80%] absolute h-[88.3%] flex flex-col justify-start transition-all"
})

useButton({
  parent: "friendsRequests",
  id: "requestsHeader",
  style: "w-full blured-20 text-white bg-stone-900/20 h-[13%] flex justify-around gap-1 items-center",
  onClick: () => {
    updateRequestBlockState()
  }
})

useDiv({
  parent: "requestsHeader",
  content: "Incoming Requests",
  id: "requestsHeaderText"
})

useButton({
  parent: "requestsHeader",
  id: "requestSwitchButton",
  content: "🕜",
  size: "sm",
  type: "secondary",
  onClick: () => {
    useRequestBlock(false)
  }
})
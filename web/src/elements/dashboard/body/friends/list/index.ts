import { useDiv, useButton } from "@trippler/tr_kit/web"
import { useFriendsList } from "../../../../../modules/dashboard/friendsPanel"
import('./current')
import('./search')

useDiv({
  parent: "friendsPanel",
  id: "friendsList",
  style: "w-full top-0 absolute h-[90%] flex flex-col justify-start transition-all"
})

useDiv({
  parent: "friendsList",
  id: "friendsHeader",
  style: "w-full blured-20 text-white bg-stone-900/20 h-[13%] flex justify-around gap-1 items-center"
})

useDiv({
  parent: "friendsList",
  id: "friendsContainer" ,
  style: "w-full h-[88%] flex flex-col justify-center items-center" 
})

useDiv({
  parent: "friendsContainer",
  id: "friendsItems",
  style: "w-full h-fit overflow-auto [scrollbar-width:none]"
})

useDiv({
  parent: "friendsContainer",
  id: "playersItems",
  style: "w-full hidden h-full overflow-auto [scrollbar-width:none]"
})

useDiv({
  parent: "playersItems",
  id: "playersSearchContainer",
  style: "w-full flex flex-col gap-2"
})

useDiv({
  parent: "playersSearchContainer",
  id: "playersResults",
  style: "w-full flex flex-col gap-2"
})

useDiv({
  parent: "friendsHeader",
  id: "friendsHeaderText",
  content: "Friends List"
})

useButton({
  parent: "friendsHeader",
  content: "➕",
  size: "sm",
  type: "secondary",
  onClick: () => {
    useFriendsList()
  }
})
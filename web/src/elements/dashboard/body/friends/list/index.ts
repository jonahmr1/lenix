import { useDiv, useButton } from "@trippler/tr_kit/web"
import { useFriendsPanel } from "../../../../../hooks/dashboard/useFriendsPanel"
import('./current')
import('./search')

useDiv({
  parent: "friendsPanel",
  id: "friendsList",
  className: "w-full top-0 absolute h-[90%] flex flex-col justify-start transition-all"
})

useDiv({
  parent: "friendsList",
  id: "friendsHeader",
  className: "w-full blured-20 text-white bg-stone-900/20 h-[13%] flex justify-around gap-1 items-center"
})

useDiv({
  parent: "friendsList",
  id: "friendsContainer" ,
  className: "w-full h-[88%] flex flex-col justify-center items-center" 
})

useDiv({
  parent: "friendsContainer",
  id: "friendsItems",
  className: "w-full h-fit overflow-auto [scrollbar-width:none]"
})

useDiv({
  parent: "friendsContainer",
  id: "playersItems",
  className: "w-full hidden h-full overflow-auto [scrollbar-width:none]"
})

useDiv({
  parent: "playersItems",
  id: "playersSearchContainer",
  className: "w-full flex flex-col gap-2"
});

useDiv({
  parent: "playersSearchContainer",
  id: "playersResults",
  className: "w-full flex flex-col gap-2"
});

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
    useFriendsPanel()
  }
})
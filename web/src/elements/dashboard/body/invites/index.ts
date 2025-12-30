import { useButton, useDiv} from "@trippler/tr_kit/web"

useDiv({
  parent: "body",
  id: "invites",
  className: "w-[65%] h-[75%] flex justify-between items-center gap-[25%]"
})

useDiv({
  parent: "invites",
  id: "left-InviteSide",
  className: "w-full flex justify-around"
})

useDiv({
  parent: "invites",
  id: "right-InviteSide",
  className: "w-full flex justify-around"
})

useButton({
  parent: "left-InviteSide",
  content: "+",
  size: "sm",
  type: "soft"
})

useButton({
  parent: "left-InviteSide",
  content: "+",
  size: "sm",
  type: "soft"
})

useButton({
  parent: "right-InviteSide",
  content: "+",
  size: "sm",
  type: "soft"
})

useButton({
  parent: "right-InviteSide",
  content: "+",
  size: "sm",
  type: "soft"
})
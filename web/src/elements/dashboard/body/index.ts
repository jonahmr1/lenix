import { useDiv } from "@trippler/tr_kit/web"
import('./menus')
import('./invites')
import('./friends')

useDiv({
  parent: "root",
  id: "body",
  className: "w-full h-[92vh] flex items-center justify-end gap-[1%]"
})
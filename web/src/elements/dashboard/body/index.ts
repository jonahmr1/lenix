import { useDiv } from "@trippler/tr_kit/web"

useDiv({
  parent: "dashboard-root",
  id: "dashboard-body",
  className: "w-full h-[92vh] flex items-center justify-end gap-[1%]"
})

import('./menus')
import('./invites')
import('./friends')
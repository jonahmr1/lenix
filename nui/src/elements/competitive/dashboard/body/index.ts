import { useDiv } from "@trippler/tr_kit/nui"

useDiv({
  parent: "competitive-dashboard-root",
  id: "dashboard-body",
  style: "w-full h-[92vh] flex items-center justify-end gap-[1%]"
})

import('./menus')
import('./invites')
import('./friends')
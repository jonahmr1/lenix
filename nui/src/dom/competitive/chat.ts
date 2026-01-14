import { nuiFocus } from "@trippler/tr_lib/nui"
import useUnfocus from "../../modules/competitive/chat/closeChat"

const block = document.getElementById('block')

document.addEventListener('mousedown', (event) => {
  if (block && !block.contains(event.target as Node)) useUnfocus()
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') useUnfocus()
  else if (event.key === 'F11') nuiFocus(true, true)
})
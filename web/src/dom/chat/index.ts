import { nuiFocus } from "@trippler/tr_lib/web"
import useUnfocus from "../../hooks/chat/useUnfocus"

const block = document.getElementById('block')

document.addEventListener('mousedown', (event) => {
  if (block && !block.contains(event.target as Node)) {
    useUnfocus()
  }
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    useUnfocus()
  } else if (event.key === 'F11') {
    nuiFocus(true, true)
  }
})
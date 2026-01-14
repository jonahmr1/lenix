import { nuiFocus } from "@trippler/tr_lib/nui"

const root = document.getElementById(`chat-root`)

export const openChat = () => {
  nuiFocus(true, false)
  if (!root) return
  root.classList.remove('hidden')
  const inputElement = document.querySelector('.input') as HTMLInputElement
  inputElement?.focus()
}

export const hideChat = () => {
  nuiFocus(false, false)
  if (root) root.classList.add('hidden')
}
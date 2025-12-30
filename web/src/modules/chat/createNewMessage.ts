import { maxTextLength, messagesCooldown } from "../../../../shared/constants"
import useCooldown from "../../hooks/chat/useCooldown"
import { input } from "../../elements/chat"
import { triggerNuiCallback } from "@trippler/tr_lib/web"
import { setInCooldown } from "../../hooks/chat"

let canSend = true

export default (message: string) => {
  if (!message.trim()) return
  if (!canSend) return
  if (message.length > maxTextLength) return
  
  useCooldown()
  canSend = false
  setTimeout(() => {
    canSend = true
    setInCooldown(false)
  }, messagesCooldown * 1000);
  
  input.value = ''

  const characterLeftElement = document.getElementById('characters-left')
  characterLeftElement?.classList.add('hidden')

 const response = triggerNuiCallback<boolean>('createNewMessageRequest', { message })
 if (!response) {
  throw new Error("Failed to create new message")
 }
}
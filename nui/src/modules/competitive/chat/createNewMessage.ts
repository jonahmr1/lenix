import { maxTextLength, messagesCooldown } from "../../../../../shared/constants/competitive"
import useCooldown from "./addCooldown"
import { input } from "../../../elements/competitive/chat"
import { triggerNuiCallback } from "@trippler/tr_lib/nui"
import { setState } from "../../../states/competitive"

let canSend = true

export default (message: string) => {
  if (!message.trim()) return
  if (!canSend) return
  if (message.length > maxTextLength) return
  
  useCooldown()
  canSend = false
  setTimeout(() => {
    canSend = true
    setState.inCooldown(false)
  }, messagesCooldown * 1000)
  
  input.value = ''

  const characterLeftElement = document.getElementById('characters-left')
  characterLeftElement?.classList.add('hidden')

 const response = triggerNuiCallback<boolean>('chat/createNewMessageRequest', { message })
 if (!response) {
  throw new Error("Failed to create new message")
 }
}
import { onNuiCallback } from "@trippler/tr_lib/nui"
import { Message, Suggestion } from "../../../../shared/types/freeroam"
import { addMessage, addSuggestion, removeSuggestion } from "../../modules/freeroam/chat"
import { openChat } from "../../modules/freeroam/chat/toggles"

onNuiCallback('chat/openChat', () => {
  openChat()
})

/* setTimeout(() => {
  openChat()
  addMessage({
    args: ['Hello, World!']
  })
  setTimeout(() => {
    addMessage({
      args: ['This is Lenix']
    })
    setTimeout(() => {
      addMessage({
        args: ['This is Dark']
      })
      setTimeout(() => {
        addMessage({
          args: ['This is W2fy']
        })
      }, 1000)
    }, 1000)
  }, 1000)
}) */

onNuiCallback('chat/message', (message: Message) => {
  addMessage(message)
})

onNuiCallback('chat/addSuggestion', (name: Suggestion['name'], help: Suggestion['help'], params: Suggestion['params']) => {
  addSuggestion(name, help, params)
})

onNuiCallback('chat/removeSuggestion', (name: Suggestion['name']) => {
  removeSuggestion(name)
})

export const sendCommand = (raw: string) => {
  sendCommand(raw)
}
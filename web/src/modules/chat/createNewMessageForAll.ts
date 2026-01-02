import { useDiv } from "@trippler/tr_kit/web"
import { PlayerObject } from "../../../../shared/types"
import { messagesFadeDuration } from "../../../../shared/constants"
import { getState, setState } from "../../states"

export default (message: string, player: PlayerObject) => {
  useDiv({
    parent: 'messages',
    id: 'message-' + setState.messageCount(getState.messageCount++),
    className: 'w-full text-white text-lg p-1 rounded flex flex-wrap items-start gap-1 transition-opacity duration-[5s] opacity-100',
  })

  useDiv({
    parent: "message-" + getState.messageCount,
    className: "text-stone-400 text-lg shrink-0",
    content: '@' + player.name
  })

  useDiv({
    parent: "message-" + getState.messageCount,
    className: "text-[" + player.role.color + "] text-lg shrink-0",
    content: ' (' + player.role.name + '): '
  })

  useDiv({
    parent: "message-" + getState.messageCount,
    className: "text-white text-lg break-words min-w-0",
    content: message
  })

  const messageElement = document.getElementById('message-' + getState.messageCount)

  if (messageElement) {
    getState.pendingMessageForFadeCount.push(getState.messageCount)
    const currentMessageId = getState.messageCount
    setTimeout(() => {
      setState.pendingMessageForFadeCount(getState.pendingMessageForFadeCount.filter((id) => id !== currentMessageId))
      if (!getState.focused) {
        messageElement.classList.remove('opacity-100')
        messageElement.classList.add('opacity-0')
      }
    }, messagesFadeDuration)
  }
  const messages = document.getElementById('messages')
  if (messages) {
    messages.scrollTop = messages.scrollHeight
  }
}
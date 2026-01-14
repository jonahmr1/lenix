import { useDiv } from '@trippler/tr_kit/nui'
import { Message } from '../../../../../shared/types'

useDiv({
  parent: `chat-container`,
  id: `chat-messages`,
  style: `w-full h-full bg-stone-800`
})

const createMessage = (message: Message['args'][number]) => {
  useDiv({
    parent: `chat-messages`,
    content: message,
    style: `text-white`
  })
}

export const createNewMessage = (messages: Message['args']) => {
  messages.forEach(message => {
    createMessage(message)
  });
}
import { useDiv } from '@trippler/tr_kit/nui'
import('./messages')
import('./input')

useDiv({
  parent: `body`,
  id: `freeroam-chat-root`,
  style: `w-full h-[100vh] hidden`
})

useDiv({
  parent: `freeroam-chat-root`,
  id: `chat-container`,
  style: `w-[33%] h-[66%] bg-stone-900 flex flex-col gap-4`
})
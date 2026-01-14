import { useButton, useInput, useDiv } from '@trippler/tr_kit/nui'
import { messagesCooldown } from '../../../../../shared/constants/competitive'
import useCharacterLeft from '../../../modules/competitive/chat/updateCharactersLeft'
import createNewMessage from '../../../modules/competitive/chat/createNewMessage'

useDiv({
  parent: 'body',
  id: 'competitive-chat-root',
  style: 'select-none w-full h-screen absolute'
})

useDiv({
  parent: 'competitive-chat-root',
  id: 'container',
  style: 'w-full h-[80vh] flex items-end justify-start px-2'
})

useDiv({
  parent: 'container',
  id: 'block',
  style: "w-[30%] h-[50%] flex flex-col p-1 gap-1 rounded-md border-stone-800/50"
})

useDiv({
  parent: 'block',
  id: 'messages',
  style: "w-full flex-1 flex flex-col px-1 overflow-y-auto [scrollbar-width:none]",
})

useDiv({
  parent: 'messages',
  id: 'spacer',
  style: 'flex-1'
})

useDiv({
  parent: 'block',
  id: 'input',
  style: 'w-full h-fit bg-stone-600 flex items-center gap-1 px-1 opacity-0 rounded-md',
})

export const input = useInput({
  parent: 'input',
  style: 'input flex-1 bg-transparent text-white text-lg outline-none px-1',
  placeholder: 'Say to all',
  onSubmit: () => createNewMessage(input.value),
  onChange: () => useCharacterLeft(input.value.length),
})

useButton({
  parent: 'input',
  type: 'secondary',
  size: 'lg',
  content: 'Send',
  onClick: () => createNewMessage(input.value),
  disableKey: true
})

useDiv({
  parent: 'block',
  id: 'cooldown-bar',
  style: `h-[1%] bg-blue-500 transition-[width] duration-[${messagesCooldown}s] ease-linear opacity-0`,
})

useDiv({
  parent: 'block',
  style: 'w-full h-[10%] text-lg text-stone-200 px-1 hidden',
  id: 'characters-left',
})


const styles = document.createElement('style')
styles.innerHTML = `
  #messages {
    scrollbar-width: none; /* Firefox */
  }

  #messages::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
`
document.head.appendChild(styles)
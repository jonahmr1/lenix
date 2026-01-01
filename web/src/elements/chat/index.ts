import { useButton, useInput, useDiv } from '@trippler/tr_kit/web'
import { messagesCooldown } from '../../../../shared/constants'
import useCharacterLeft from '../../hooks/chat/useCharactersLeft'
import createNewMessage from '../../modules/chat/createNewMessage'

document.body.className = '[scrollbar-width:none]'

useDiv({
  parent: 'body',
  id: 'chat-root',
  className: 'select-none w-full h-screen absolute'
})

useDiv({
  parent: 'chat-root',
  id: 'container',
  className: 'w-full h-[80vh] flex items-end justify-start px-2'
})

useDiv({
  parent: 'container',
  id: 'block',
  className: "w-[30%] h-[50%] flex flex-col p-1 gap-1 rounded-md border-stone-800/50"
})

useDiv({
  parent: 'block',
  id: 'messages',
  className: "w-full flex-1 flex flex-col px-1 overflow-y-auto [scrollbar-width:none]",
})

useDiv({
  parent: 'messages',
  id: 'spacer',
  className: 'flex-1'
})

useDiv({
  parent: 'block',
  id: 'input',
  className: 'w-full h-fit bg-stone-600 flex items-center gap-1 px-1 opacity-0 rounded-md',
})

export const input = useInput({
  parent: 'input',
  className: 'input flex-1 bg-transparent text-white text-lg outline-none px-1',
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
  className: `h-[1%] bg-blue-500 transition-[width] duration-[${messagesCooldown}s] ease-linear opacity-0`,
})

useDiv({
  parent: 'block',
  className: 'w-full h-[10%] text-lg text-stone-200 px-1 hidden',
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
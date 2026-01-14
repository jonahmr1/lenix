import { useButton, useInput, useDiv } from '@trippler/tr_kit/nui'
import useUpdateSuggetions from '../../../modules/chat/updateSuggetions'
import { useChangeBorderColor } from '../../../modules/chat/changeBorderColor'
import { sendCommand } from '../../../api/chat'
import { clearStoredFrequentlyUsedCommands, useStoreFrequentlyUsedCommands } from '../../../modules/chat/localStorage'
import { getPassedArgumentsFirstString } from '../../../utils/chat'
import { useClearCommandSelection } from '../../../modules/chat/commandSelection'
import { chat } from '../../../../../shared/constants'

useDiv({
  parent: `chat-container`,
  id: `chat-input`,
  style: `w-full h-[40%] bg-stone-600 flex flex-col gap-1`
})

export const input = useInput({
  parent: `chat-input`,
  placeholder: `type / to start a command`,
  style: `input w-full bg-stone-700 p-2 outline-none text-white transition-all`,
  onChange: () => {
    useUpdateSuggetions(input.value)
    useChangeBorderColor(input.value)
  },
  onSubmit: () => {
    sendCommand(input.value)
    input.value[0] === `/` && useStoreFrequentlyUsedCommands(getPassedArgumentsFirstString(input.value))
    useUpdateSuggetions(``)
    input.value = ``
  },
})

useDiv({
  parent: `chat-input`,
  id: `chat-suggestions-items`,
  style: `relative w-full h-full bg-inherit flex flex-col justify-between`,
})

useButton({
  parent: `chat-suggestions-items`,
  content: '<i class="fas fa-trash"></i>',
  style: `absolute top-0 right-0 text-stone-400 z-10 hover:text-stone-300 mx-2`,
  onClick: () => {
    clearStoredFrequentlyUsedCommands()
    useClearCommandSelection()
    useUpdateSuggetions(``)
    input.value = ``
  }
})

setTimeout(() => {
  [...Array(chat.suggestionsCount)].forEach((_, index) => {
    useDiv({
      parent: `chat-suggestions-items`,
      id: `chat-suggestion-item-${index}`,
      style: `w-full h-fit bg-inherit text-stone-300 flex flex-col gap-1`,
    })
  })
})
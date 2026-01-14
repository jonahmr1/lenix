import { useDiv } from "@trippler/tr_kit/nui"
import { findClosest, getCommandArguments, getPassedArgumentsLastIndex, getPassedArgumentsFirstString, isInShowRecentCommandsPosition, isTextInCommandSyntax, getCommandHelp, isCharNumber, getPassedBlocksCount, getPassedSpacesCount } from "../../utils/chat"
import { preventPlaceholderDuplication } from "."
import { changeBorderColor } from "./changeBorderColor"
import { getStoredFrequentlyUsedCommands } from "./localStorage"
import { getState } from "../../states"
import { chat } from "../../../../../shared/constants/freeroam"
import { Suggestion, CommandName } from "../../../../../shared/types/freeroam"
import { useClearCommandSelection } from "./commandSelection"

export let closestRelative: string | undefined
export let resultsFound: number = 0

const createArgument = ({
  commandIndex,
  argumentIndex,
  lastIndex,
  typedText,
  argumentsLength,
  ...param
}: {
  commandIndex: number
  argumentIndex: number
  lastIndex: number,
  typedText: string,
  argumentsLength: number,
} & Suggestion['params'][number]) => {
  let className: string | undefined
  if (typedText[typedText.length - 1] !== ` ` && param.type) {
    const isStringValidNumber = (param.type === 'number' || param.type === 'playerId') && isCharNumber(typedText[typedText.length - 1])
    const isStringValidString = param.type === 'string' && !isCharNumber(typedText[typedText.length - 1])

    if (isStringValidNumber || isStringValidString) {
      if (argumentsLength === getPassedBlocksCount(typedText) - 1) {
        setTimeout(() => {
          changeBorderColor(`ring-green-600/60`)
        }, 0)
      }
      className = `${lastIndex === argumentIndex + 1 ? 'text-green-300' : 'text-stone-400'}`
    } else {
      className = `${lastIndex === argumentIndex + 1 ? 'text-red-300' : 'text-stone-400'}`
    }
  } else {
    className = `${lastIndex === argumentIndex + 1 ? 'text-stone-300' : 'text-stone-400'}`
  }
  useDiv({
    parent: `chat-suggestion-item-${commandIndex}-arguments`,
    id: `chat-suggestion-item-${argumentIndex + 1}-argument`,
    style: className,
    content: param.name
  })
  if (lastIndex === argumentIndex + 1) {
    useDiv({
      parent: `chat-suggestion-item-${commandIndex}`,
      id: `chat-suggestion-item-${commandIndex}-help`,
      content: `${param.help ? `${param.help}` : ''}${param.type ? ` [type: ${param.type}]` : ''}${param.optional ? ' (optional)' : ''}`
    })
  }
}

const createCommand = (commandIndex: number, command: CommandName, lastIndex: number, typedText: string) => {
  if (command !== getPassedArgumentsFirstString(typedText) && getPassedSpacesCount(typedText) >= 1) return
  useDiv({
    parent: `chat-suggestion-item-${commandIndex}`,
    id: `chat-suggestion-item-${commandIndex}-arguments`,
    style: `flex gap-1`
  })
  useDiv({
    parent: `chat-suggestion-item-${commandIndex}-arguments`,
    id: `chat-suggestion-item-0-argument`,
    content: `/${command}`
  })
  if (lastIndex === 0) {
    const commandHelp = getCommandHelp(command)
    useDiv({
      parent: `chat-suggestion-item-${commandIndex}`,
      id: `chat-suggestion-item-${commandIndex}-help`,
      content: commandHelp
    })
  }
  const argumentsObject = getCommandArguments(command)
  for (let i = 0; i < (argumentsObject ?? [])?.length; i++) {
    if (!argumentsObject?.[i]) continue
    createArgument({
      commandIndex,
      argumentIndex: i,
      lastIndex,
      typedText,
      argumentsLength: argumentsObject.length,
      name: argumentsObject[i].name,
      help: argumentsObject[i].help,
      type: argumentsObject[i].type, 
      optional: argumentsObject[i].optional
    })
  }
}

export default (typedText: string) => {
  const recentCommands = getStoredFrequentlyUsedCommands()
  closestRelative = undefined
  resultsFound = 0
  for (let i = 0; i < chat.suggestionsCount; i++) {
    preventPlaceholderDuplication(i)
    const commandItem = document.getElementById(`chat-suggestion-item-${i}`)!

    if (isTextInCommandSyntax(typedText)) {
      if (isInShowRecentCommandsPosition(typedText)) {
        if (!recentCommands[i]) continue
        resultsFound++
        if (!closestRelative) {
          closestRelative = recentCommands[i]
          createCommand(i, recentCommands[i], getPassedArgumentsLastIndex(typedText), typedText)
        } else {
          createCommand(i, recentCommands[i], getPassedArgumentsLastIndex(typedText), typedText)
        }
      } else {
        const commandSuggested = findClosest(getPassedArgumentsFirstString(typedText))[i]
        if (commandSuggested) {
          resultsFound++
          if (!closestRelative) {
            closestRelative = commandSuggested
            createCommand(i, commandSuggested, getPassedArgumentsLastIndex(typedText), typedText)
          } else {
            createCommand(i, commandSuggested, getPassedArgumentsLastIndex(typedText), typedText)
          }
        } else {
          commandItem.textContent = ``
          if (getState.currentItemSelected?.id === `chat-suggestion-item-${i}`) {
            useClearCommandSelection()
          }
        }
      }
    } else {
      commandItem.textContent = ``
      useClearCommandSelection()
    }
  }
}
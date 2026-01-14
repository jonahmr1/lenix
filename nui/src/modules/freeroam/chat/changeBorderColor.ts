import { input } from "../../../elements/freeroam/chat/input"
import { getCommandArguments, getPassedArgumentsFirstString, getPassedBlocksCount } from "../../../utils/chat"

let lastProperty: string

export const changeBorderColor = (prorerty?: string) => {
  if (!prorerty) {
    input?.classList?.remove(`ring-1`) 
    return
  }
  input?.classList?.add(`ring-1`) 
  input?.classList?.remove(lastProperty) 
  input?.classList?.add(prorerty)  
  lastProperty = prorerty 
}

export const useChangeBorderColor = (characters: string) => {
  if (characters?.length < 2 || characters?.[0] !== `/`) {
    changeBorderColor()
    return
  }
  const commandName = getPassedArgumentsFirstString(characters)
  const index = getPassedBlocksCount(characters)
  if (index == getCommandArguments(commandName)?.length) {
    changeBorderColor(`ring-green-600/60`)
    return
  }
  if (index > (getCommandArguments(commandName) ?? [])?.length) {
    changeBorderColor(`ring-yellow-600/60`)
    return
  }
  changeBorderColor(`ring-red-600/60`)
}
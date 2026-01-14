import { CommandName } from "../../../../../shared/types/freeroam"
import { getState } from "../../states"

const getCommandNames = () => {
  let commandNames: string[] = []
  for (const key in getState.suggestions) {
    commandNames.push(getState.suggestions[key].name)
  }
  return commandNames
}

export const getCommandHelp = (command: CommandName) => {
  for (const key in getState.suggestions) {
    if (getState.suggestions[key].name === command) {
      return getState.suggestions[key].help
    }
  }
}

export const getCommandArguments = (command: CommandName) => {
  for (const key in getState.suggestions) {
    if (getState.suggestions[key].name === command) {
      return getState.suggestions[key].params
    }
  }
}

export const findClosest = (input: string) => {
  const lower = input.toLowerCase()
  const command = getCommandNames().filter(word => word.toLowerCase().includes(lower)).sort((a, b) => {
    const aStarts = a.toLowerCase().startsWith(lower)
    const bStarts = b.toLowerCase().startsWith(lower)
    if (aStarts && !bStarts) return -1
    if (!aStarts && bStarts) return 1
    return a.length - b.length
  })
  return command
}

export const getPassedArgumentsFirstString = (characters: string) => {
  let filteredString = characters.slice(1)
  for (let i = 0; i < characters.length; i++) {
    if (characters[i] === ` `) {
      filteredString = characters.slice(1, i)
      break
    }
  }
  return filteredString as CommandName
}

export const getPassedArgumentsLastIndex = (characters: string) => {
  let index = 0
  for (let i = 0; i < characters.length; i++) {
    if (characters[i] === ` ` && characters[i - 1] !== ` `) {
      index++
    }
  }
  return index
}

export const isInShowRecentCommandsPosition = (characters: string) => {
  return characters.length === 1
}

export const isTextInCommandSyntax = (characters: string) => {
  return characters[0] === '/' && characters[1] !== ` `
}

export const getArrayfiedPassedCharacters = (characters: string) => {
  let command: string[] = []
  let word = ''
  for (let i = 0; i < characters.length; i++) {
    if (characters[i] !== ` ` && characters[i] !== `/`) {
      word += characters[i]
    } else if (word) {
      command.push(word)
      word = ''
    }
  }
  if (word) command.push(word)
  return command
}

export const isCharNumber = (character: string) => {
  return /^\d+$/.test(character)
}

export const getPassedBlocksCount = (characters: string) => {
  let index = 0
  for (let i = 0; i < characters.length; i++) {
    if (characters[i] !== ` ` && characters[i - 1] === ` `) {
      index++
    }
  }
  return index
}

export const getPassedSpacesCount = (characters: string) => {
  return characters.split(' ').length - 1
}
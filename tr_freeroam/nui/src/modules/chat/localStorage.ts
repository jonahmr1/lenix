import { CommandName } from "../../../../shared/types"

export const useStoreFrequentlyUsedCommands = (command: string) => {
  const previousStoredCommands = getStoredFrequentlyUsedCommands()
  
  if (previousStoredCommands.includes(command)) {
    const filtered = previousStoredCommands.filter(storedCommand => storedCommand !== command)
    localStorage.setItem('frequentlyUsedCommands', JSON.stringify([command, ...filtered]))
    return
  }
  
  localStorage.setItem('frequentlyUsedCommands', JSON.stringify([command, ...previousStoredCommands]))
}

export const getStoredFrequentlyUsedCommands = (): CommandName[] => {
  return JSON.parse(localStorage.getItem('frequentlyUsedCommands') || '[]')
}

export const clearStoredFrequentlyUsedCommands = () => {
  localStorage.removeItem('frequentlyUsedCommands')
}
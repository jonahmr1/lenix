export let inCooldown = false
export let messageCount = 0
export let isFocused = false
export let pendingMessageForFadeCount: number[] = []

export const setFocus = (state: boolean) => isFocused = state
export const setMessagesCount = (count: number) => messageCount = count
export const setPendingMessageForFadeCount = (count: number[]) => pendingMessageForFadeCount = count
export const setInCooldown = (state: boolean) => inCooldown = state
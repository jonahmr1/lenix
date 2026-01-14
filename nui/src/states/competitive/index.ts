export const setState = {
  requestBlockCoollapsed: (state: boolean) => getState.requestBlockCoollapsed = state,
  dashboard: (state: boolean) => getState.dashboardOn = state,
  inCooldown: (state: boolean) => getState.inCooldown = state,
  messageCount: (count: number) => getState.messageCount = count,
  focused: (state: boolean) => getState.focused = state,
  pendingMessageForFadeCount: (count: number[]) => getState.pendingMessageForFadeCount = count,
  friendsPanelCollapsed: (state: boolean) => getState.friendsPanelCollapsed = state,
  isFriendsListSelected: (state: boolean) => getState.isFriendsListSelected = state,
  requestsBlockSelected: (state: string) => getState.requestsBlockSelected = state
}

export const getState = {
  requestBlockCoollapsed: false,
  dashboardOn: false,
  inCooldown: false,
  messageCount: 0,
  focused: false,
  pendingMessageForFadeCount: [] as number[],
  friendsPanelCollapsed: true,
  isFriendsListSelected: true,
  requestsBlockSelected: "incoming"
}
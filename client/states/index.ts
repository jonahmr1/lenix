let netIdsRequested: unknown[] = []
let playerJob: unknown = {}

export const setState = {
  netIdsRequested: (state: unknown[]) => netIdsRequested = state,
  playerJob: (state: unknown) => playerJob = state
}

export const getState = {
  netIdsRequested: [] as number[],
  playerJob: {} as unknown
}
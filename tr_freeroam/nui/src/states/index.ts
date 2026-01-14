import { Suggestion } from "../../../shared/types"

export const setState = {
  currentItemSelected: (element: typeof getState.currentItemSelected) => getState.currentItemSelected = element
}

export const getState = {
  currentItemSelected: undefined as HTMLElement | Element | null | undefined,
  suggestions: [] as Suggestion[]
}
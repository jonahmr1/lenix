'use client'

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

type AppState = {
  playlistsOpen: boolean
  queueOpen: boolean
}

const AppContext = createContext<{
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    playlistsOpen: true,
    queueOpen: true,
  })

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

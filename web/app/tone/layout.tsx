'use client'

import type { ReactNode } from 'react'
import { AppProvider } from './provider'

export default function ToneLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
			{children}
    </AppProvider>
  )
}

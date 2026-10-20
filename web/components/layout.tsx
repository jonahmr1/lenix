import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export const Layout = ({
  children,
  className,
}: {
  children: ReactNode
  className?: HTMLDivElement['className']
}) => (
  <div
    className={cn(
      'flex min-h-screen flex-col justify-center space-y-[15vh] bg-background px-[15vw] py-[15vh] portrait:px-[5vw]',
      className
    )}
  >
    {children}
  </div>
)

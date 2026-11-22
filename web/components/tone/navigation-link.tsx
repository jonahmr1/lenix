'use client'

import Link, { useLinkStatus } from 'next/link'
import type { ComponentProps } from 'react'

function NavigationPending() {
  const { pending } = useLinkStatus()
  return <span hidden data-navigation-pending={pending} />
}

export default function NavigationLink({
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link {...props}>
      <NavigationPending />
      {children}
    </Link>
  )
}

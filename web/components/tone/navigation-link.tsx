'use client'

import Link, { useLinkStatus } from 'next/link'
import { useLayoutEffect, useRef, type ComponentProps } from 'react'

function NavigationPending() {
  const { pending } = useLinkStatus()
  const marker = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const element = marker.current
    if (!pending || !element) return
    element.dataset.navigationPending = 'true'
    // Cached pages remain in the DOM, but their effects clean up when hidden.
    return () => element.removeAttribute('data-navigation-pending')
  }, [pending])

  return <span hidden ref={marker} />
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

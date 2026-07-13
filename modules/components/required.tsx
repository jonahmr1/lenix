import type { JSX } from 'react'

/**
 * Renders a required-field marker.
 *
 * @example
 * ```tsx
 * <span>Email address <Required /></span>
 * ```
 */
export const Required = (): JSX.Element => <span className='text-destructive'>*</span>

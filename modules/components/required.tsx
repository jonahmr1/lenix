import type React from 'react'
/**
 * @module
 * Custom html element
 * @example
 * <span>Email address <Required /></span>
 */
export const Required = (): React.JSX.Element => <span className='text-destructive'>*</span>

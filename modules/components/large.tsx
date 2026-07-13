import type React from 'react'
/**
 * @module
 * Custom html element
 * @param children - other elements that goes inside
 * @example
 * <Large>this is an example</Large>
 */
export const Large = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<div className='text-lg font-semibold'>{children}</div>
)

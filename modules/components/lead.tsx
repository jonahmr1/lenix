import type React from 'react'
/**
 * @module
 * Custom html element
 * @param children - other elements that goes inside
 * @example
 * <Lead>this is an example</Lead>
 */
export const Lead = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<p className='text-xl text-foreground'>{children}</p>
)

import type React from 'react'
/**
 * @module
 * Custom html element
 * @param children - other elements that goes inside
 * @example
 * <Muted>this is an example</Muted>
 */
export const Muted = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<p className='text-sm text-muted-foreground'>{children}</p>
)

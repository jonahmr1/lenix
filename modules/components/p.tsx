import type React from 'react'
/**
 * @module
 * Custom html element
 * @param children - other elements that goes inside
 * @example
 * <P>this is an example</P>
 */
export const P = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<p className='leading-7 not-first:mt-6'>{children}</p>
)

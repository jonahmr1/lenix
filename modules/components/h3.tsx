import type React from 'react'
/**
 * @module
 * Custom html element
 * @param children - other elements that goes inside
 * @example
 * <H3>this is an example</H3>
 */
export const H3 = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>{children}</h3>
)

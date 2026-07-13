import type React from 'react'
/**
 * @module
 * Custom html element
 * @param children - other elements that goes inside
 * @example
 * <H1>this is an example</H1>
 */
export const H1 = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<h1 className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'>
		{children}
	</h1>
)

import type React from 'react'
/**
 * @module
 * Custom html element
 * @param children - other elements that goes inside
 * @example
 * <H2>this is an example</H2>
 */
export const H2 = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
		{children}
	</h2>
)

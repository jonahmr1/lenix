import type React from 'react'
/**
 * @module
 * Custom html element
 * @param children - other elements that goes inside
 * @example
 * <Code>this is an example</Code>
 */
export const Code = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
		{children}
	</code>
)

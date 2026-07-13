import type { JSX, ReactNode } from 'react'

export type H2Props = {
	/**
	 * Content rendered inside the heading.
	 */
	children: ReactNode
}

/**
 * Renders a second-level section heading.
 *
 * @example
 * ```tsx
 * <H2>this is an example</H2>
 * ```
 */
export const H2 = ({ children }: H2Props): JSX.Element => (
	<h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
		{children}
	</h2>
)

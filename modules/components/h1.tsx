import type { JSX, ReactNode } from 'react'

export type H1Props = {
	/**
	 * Content rendered inside the heading.
	 */
	children: ReactNode
}

/**
 * Renders a top-level page heading.
 *
 * @example
 * ```tsx
 * <H1>this is an example</H1>
 * ```
 */
export const H1 = ({ children }: H1Props): JSX.Element => (
	<h1 className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'>
		{children}
	</h1>
)

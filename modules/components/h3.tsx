import type { JSX, ReactNode } from 'react'

/**
 * Props for {@link H3}.
 */
export type H3Props = {
	/**
	 * Content rendered inside the heading.
	 */
	children: ReactNode
}

/**
 * Renders a third-level section heading.
 *
 * @example
 * ```tsx
 * <H3>this is an example</H3>
 * ```
 */
export const H3 = ({ children }: H3Props): JSX.Element => (
	<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>{children}</h3>
)

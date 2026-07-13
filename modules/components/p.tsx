import type { JSX, ReactNode } from 'react'

/**
 * Props for {@link P}.
 */
export type PProps = {
	/**
	 * Content rendered inside the paragraph.
	 */
	children: ReactNode
}

/**
 * Renders paragraph text with default spacing.
 *
 * @example
 * ```tsx
 * <P>this is an example</P>
 * ```
 */
export const P = ({ children }: PProps): JSX.Element => (
	<p className='leading-7 not-first:mt-6'>{children}</p>
)

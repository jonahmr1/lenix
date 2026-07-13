import type { JSX, ReactNode } from 'react'

/**
 * Props for {@link Large}.
 */
export type LargeProps = {
	/**
	 * Content rendered inside the text block.
	 */
	children: ReactNode
}

/**
 * Renders emphasized large text.
 *
 * @example
 * ```tsx
 * <Large>this is an example</Large>
 * ```
 */
export const Large = ({ children }: LargeProps): JSX.Element => (
	<div className='text-lg font-semibold'>{children}</div>
)

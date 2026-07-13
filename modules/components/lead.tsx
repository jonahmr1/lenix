import type { JSX, ReactNode } from 'react'

export type LeadProps = {
	/**
	 * Content rendered inside the lead paragraph.
	 */
	children: ReactNode
}

/**
 * Renders lead paragraph text.
 *
 * @example
 * ```tsx
 * <Lead>this is an example</Lead>
 * ```
 */
export const Lead = ({ children }: LeadProps): JSX.Element => (
	<p className='text-xl text-foreground'>{children}</p>
)

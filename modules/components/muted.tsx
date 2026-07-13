import type { JSX, ReactNode } from 'react'

/**
 * Props for {@link Muted}.
 */
export type MutedProps = {
	/**
	 * Content rendered inside the muted paragraph.
	 */
	children: ReactNode
}

/**
 * Renders small muted paragraph text.
 *
 * @example
 * ```tsx
 * <Muted>this is an example</Muted>
 * ```
 */
export const Muted = ({ children }: MutedProps): JSX.Element => (
	<p className='text-sm text-muted-foreground'>{children}</p>
)

import type { ComponentProps, JSX, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

/**
 * Props for {@link Ul}.
 */
export type UlProps = {
	/**
	 * List items rendered inside the unordered list.
	 */
	children: ReactNode,

	/**
	 * Additional class names merged with the default list styles.
	 */
	className?: ComponentProps<'ul'>['className']
}

/**
 * Renders an unordered list with default spacing and bullet styling.
 *
 * @example
 * ```tsx
 * <Ul>
 * 	<li>this is an example</li>
 * </Ul>
 * ```
 */
export const Ul = ({ children, className }: UlProps): JSX.Element => (
	<ul className={twMerge('mb-6 ml-6 list-disc [&>li]:mt-2', className)}>{children}</ul>
)

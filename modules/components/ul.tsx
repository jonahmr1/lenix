import type React from 'react'
import { twMerge } from 'tailwind-merge'

/**
 * @module
 * Custom html element
 * @param children - other elements that goes inside
 * @param className - other elements classnames to include/override with the other existing classnames
 * @example
 * <Ul>
 *  <li>this is an example
 * </Ul>
 */
export const Ul = (
	{ children, className }: {
		children: React.ReactNode,
		className?: React.ComponentProps<'ul'>['className']
	}
): React.JSX.Element => (
	<ul className={twMerge('mb-6 ml-6 list-disc [&>li]:mt-2', className)}>{children}</ul>
)

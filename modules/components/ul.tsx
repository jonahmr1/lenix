import type React from 'react'
import { twMerge } from 'tailwind-merge'

export const Ul = (
	{ children, className }: {
		children: React.ReactNode,
		className?: React.ComponentProps<'ul'>['className']
	}
): React.JSX.Element => (
	<ul className={twMerge('mb-6 ml-6 list-disc [&>li]:mt-2', className)}>{children}</ul>
)

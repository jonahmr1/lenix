import type { Children } from "~/types.ts";
import { twMerge } from 'tailwind-merge'

export const Ul = ({ children, className }: Children & { className: HTMLUListElement['className'] }) => (
	<ul className={twMerge('mb-6 ml-6 list-disc [&>li]:mt-2', className)}>{children}</ul>
)

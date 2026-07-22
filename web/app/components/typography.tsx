import type { Children } from "~/types.ts";
import { twMerge } from 'tailwind-merge'

export const Code = ({ children }: Children) => (
	<code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
		{children}
	</code>
)

export const H1 = ({ children }: Children) => (
	<h1 className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'>
		{children}
	</h1>
)

export const H2 = ({ children }: Children) => (
	<h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
		{children}
	</h2>
)

export const H3 = ({ children }: Children) => (
	<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
		{children}
	</h3>
)

export const Large = ({ children }: Children) => (
	<div className='text-lg font-semibold'>
		{children}
	</div>
)

export const Lead = ({ children }: Children) => (
	<p className='text-xl text-foreground'>
		{children}
	</p>
)

export const Muted = ({ children }: Children) => (
	<p className='text-sm text-muted-foreground'>
		{children}
	</p>
)

export const P = ({ children, ...props }: Children & React.ComponentProps<'p'>) => (
	<p className='leading-7 not-first:mt-6' {...props}>
		{children}
	</p>
)

export const Required = () => (
	<span className='text-destructive'>*</span>
)

export const Ul = ({
	children, className
}: Children & { className: HTMLUListElement['className'] }) => (
	<ul className={twMerge('mb-6 ml-6 list-disc [&>li]:mt-2', className)}>
		{children}
	</ul>
)

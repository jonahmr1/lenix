import { cn } from "@/lib/utils"

interface Children { children: React.ReactNode }

export const Code = ({ children }: Children) => (
	<code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
		{children}
	</code>
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

export const Muted = ({ children, className }: Children & { className?: React.ComponentProps<'p'>['className'] }) => (
	<p className={cn('text-sm text-muted-foreground', className)}>
		{children}
	</p>
)

export const Required = () => (
	<span className='text-destructive'>*</span>
)
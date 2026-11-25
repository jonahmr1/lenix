import { cn } from 'cn'

export default ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={cn('w-full overflow-hidden rounded-2xl', className)}>
    <div className='h-full scroll-fade scrollbar-none overflow-y-auto'>
      <div className='flex flex-col gap-1.5'>{children}</div>
    </div>
  </div>
)

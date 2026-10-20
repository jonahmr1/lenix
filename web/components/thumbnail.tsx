import { cn } from 'cn'
import { AvatarImage, AvatarFallback, Avatar } from './ui/avatar'
import { Skeleton } from './ui/skeleton'

export const Thumbnail = ({
  src,
  className,
  ...props
}: {
  src: string | undefined
  className?: React.ComponentProps<typeof Avatar>['className']
} & Omit<React.ComponentProps<typeof Avatar>, 'className'>) => (
  <Avatar
    className={cn('overflow-hidden after:border-0', className)}
    {...props}
  >
    <AvatarImage className="scale-135" src={src} />
    <AvatarFallback>
      <Skeleton className="size-full bg-ring" />
    </AvatarFallback>
  </Avatar>
)

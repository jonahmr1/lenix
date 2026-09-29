import { AvatarImage, AvatarFallback, Avatar } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./ui/spinner";

export const Thumbnail = ({ src, ...props }: { src: string | undefined } & Omit<React.ComponentProps<typeof Avatar>, 'size' | 'className'>) => (
	<Avatar
		size="lg"
		className="after:border-0 overflow-hidden"
		{...props}
	>
		<AvatarImage className="scale-135" src={src} />
		<AvatarFallback>
			<Skeleton className="size-full bg-ring" />
		</AvatarFallback>
	</Avatar>
)

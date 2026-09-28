import { AvatarImage, AvatarFallback, Avatar } from "./ui/avatar";
import { Spinner } from "./ui/spinner";

export const Thumbnail = ({ src }: { src: string }) => (
	<Avatar size="lg" className="after:border-0 overflow-hidden">
		<AvatarImage className="scale-135" src={src} />
		<AvatarFallback>
			<Spinner />
		</AvatarFallback>
	</Avatar>
)

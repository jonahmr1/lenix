import { SmileySadIcon } from "@phosphor-icons/react";
import { AvatarImage, AvatarFallback, Avatar } from "./ui/avatar";

export const Thumbnail = ({ src }: { src: string }) => (
	<Avatar size="lg" className="after:border-0 overflow-hidden">
		<AvatarImage className="scale-135" src={src} />
		<AvatarFallback>
			<SmileySadIcon className="size-2/3 text-destructive" />
		</AvatarFallback>
	</Avatar>
)

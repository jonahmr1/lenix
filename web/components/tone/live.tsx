import { Badge } from "../ui/badge";

export const Live = ({ children }: { children: React.ReactNode }) => (
	<div className='flex items-center gap-[0.5vw]'>
		<Badge className='size-[1vh] p-0 bg-red-600' />
		{children}
	</div>
)
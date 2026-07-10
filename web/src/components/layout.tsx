import type { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => (
	<div className="mx-[15vw] py-[25vh] space-y-[15vh]">
		{children}
	</div>
)
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const Layout = ({ children, className }: { children: ReactNode, className?: HTMLDivElement['className'] }) => (
	<div className={twMerge("mx-[15vw] portrait:mx-[5vw] py-[15vh] space-y-[15vh] min-h-screen", className)}>
		{children}
	</div>
)
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const Layout = ({ children, className }: { children: ReactNode, className?: HTMLDivElement['className'] }) => (
	<div className={twMerge("mx-[15vw] py-[25vh] space-y-[15vh]", className)}>
		{children}
	</div>
)
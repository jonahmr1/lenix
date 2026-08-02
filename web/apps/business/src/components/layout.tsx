import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

export const Layout = ({ children, className }: { children: ReactNode, className?: HTMLDivElement['className'] }) => (
	<div className={cn("bg-background px-[15vw] portrait:px-[5vw] py-[15vh] space-y-[15vh] min-h-screen", className)}>
		{children}
	</div>
)
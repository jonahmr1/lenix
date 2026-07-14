import { ButtonGroup } from "@/components/ui/button-group"
import type { FooterLink } from "~/types"
import { Button } from "@/components/ui/button"

export const Footer = ({ links }: { links: FooterLink[] }) => (
	<div className="flex w-full items-center">
		<p className="flex-1 text-sm text-muted-foreground">All rights reserved © Code Hub</p>
		<ButtonGroup className="flex flex-1 justify-around portrait:flex-col">
			{links.map(({ label, link }) => <Button variant='link' onClick={() => {
				window.open(link, "_blank")
			}}>{label}</Button>)}
		</ButtonGroup>
		<div className="flex-1"></div>
	</div>
)
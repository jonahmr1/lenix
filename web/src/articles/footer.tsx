import type { FooterLink } from "@/types"
import { useNavigate } from "react-router-dom"
import { ButtonGroup } from "../components/ui/button-group"
import { Button } from "../components/ui/button"


export const Footer = ({ links }: { links: FooterLink[] }) => {
	const navigate = useNavigate()

	return (
		<div className="flex w-full items-center">
			<p className="flex-1 text-sm text-muted-foreground">All rights reserved</p>
			<ButtonGroup className="flex flex-1 justify-around portrait:flex-col">
				{links.map(({ label, link }) => <Button variant='link' onClick={() => {
					navigate(link)
				}}>{label}</Button>)}
			</ButtonGroup>
			<div className="flex-1"></div>
		</div>
	)
}
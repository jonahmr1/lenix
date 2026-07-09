import { toast } from "sonner"
import { Button } from "../ui/button"

export const Hero = () => {
	return (
		<div className="flex flex-col items-center gap-5">
			<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
				Developer tools built to save time.
			</h1>
			<p className="leading-7 not-first:mt-6">
				Productivity software, extensions, and utilities designed for everyday development. All products are delivered digitally after payment.
			</p>
			<Button onClick={() => 
				toast("Not available yet :(")
			}>Buy Products</Button>
		</div>
	)
}
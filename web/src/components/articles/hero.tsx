import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"

export const Hero = () => {
	const navigate = useNavigate()
	return (
		<div className="flex flex-col items-center gap-5">
			<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
				Developer tools built to save time.
			</h1>
			<p className="leading-7 not-first:mt-6">
				Code Hub develops software for developers, including productivity tools, VSCode extensions, and FiveM resources. Every product is delivered digitally and includes documentation and support.
			</p>
			<div className="flex">
				<Button onClick={() => {
					navigate('/products')
				}}>View Products</Button>
				<Button onClick={() => {
					navigate('/docs')
				}}>Documentation</Button>
			</div>
		</div>
	)
}
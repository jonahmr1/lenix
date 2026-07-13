import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Frown } from "lucide-react"
import { Layout } from "@/components/layout"
import { H1, Lead } from "@lenix/lenix"

export function NotFound() {
	const navigate = useNavigate()

	return (
		<Layout className="flex items-start flex-col mx-[30vw] space-y-4 justify-center">
			<H1>404</H1>
			<div className="flex gap-2 items-center">
				<Lead>The page you're looking for doesn't exist.</Lead>
				<Frown size={20} />
			</div>
			<Button onClick={() => {
				navigate('/')
			}}>Back Home</Button>
		</Layout>
	)
}

export default NotFound

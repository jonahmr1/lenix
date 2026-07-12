import { type LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card";

export const FeatureCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: LucideIcon }) => (
	<Card>
		<CardHeader className="gap-5">
			<Icon size={32} />
			<CardTitle>{title}</CardTitle>
		</CardHeader>
		<CardContent>
			<CardDescription>{description}</CardDescription>
		</CardContent>
	</Card>
)
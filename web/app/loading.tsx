'use client'
import { Layout } from "@/components/layout";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
	return (
		<Layout className="items-center">
			<Spinner />
		</Layout>
	)
}
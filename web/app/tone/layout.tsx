import StatesProvider from "./provider"
import Structure from "./structure"

export const metadata = {
	title: 'Tonelix',
	alternates: { canonical: 'https://lenix.dev/tone' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<StatesProvider>
			<Structure>{children}</Structure>
		</StatesProvider>
	)
}

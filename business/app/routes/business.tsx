import { Layout } from "../components/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

const tabs = [
	{
		title: 'Purchase',
		content: 'test',
	},
	{
		title: 'Subscribe',
		content: 'test'
	},
]

export default () => {
	return (
		<Layout>
			<Tabs defaultValue={'Purchase'} className='w-full'>
				<TabsList>
					{tabs.map(({ title }) => (
						<TabsTrigger value={title}>{title}</TabsTrigger>
					))}
				</TabsList>
				{tabs.map(({ title, content }) => (
					<TabsContent key={title} value={title}>{content}</TabsContent>
				))}
			</Tabs>
		</Layout>
	)
}
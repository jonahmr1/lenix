'use client'

import { Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { compact } from "@/lib/utils";
import { Lanauge } from "@/lib/types";

export const LanguagesChart = ({ langs }: { langs: Lanauge[] }) => {
	const data = {
		key: 'name',
		value: 'bytes',
	} as const satisfies Record<string, keyof typeof langs[number]>

	const chart = {
		data: langs.map(lang => ({
			[data.key]: lang.name,
			[data.value]: lang.bytes,
			fill: `var(--color-${lang.name})`
		})),
		config: Object.fromEntries(langs.map((lang, i) => [
			lang.name,
			{
				label: lang.name,
				color: `var(--chart-${i + 1 <= 5 ? i + 1 : 5})`
			}
		])) satisfies ChartConfig
	}
	return (
		<ChartContainer className="size-full" config={chart.config}>
			<PieChart>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<Pie
					data={chart.data}
					dataKey={data.value}
					nameKey={data.key}
					label={({ payload, ...props }) => (
						<text
							cx={props.cx}
							cy={props.cy}
							x={props.x}
							y={props.y}
							textAnchor={props.textAnchor}
							dominantBaseline={props.dominantBaseline}
							fill="var(--foreground)"
						>
							{compact.format(payload[data.value])}
						</text>
					)} />
				<ChartLegend
					itemSorter={null}
					content={<ChartLegendContent nameKey={data.key} />}
					className="flex-wrap gap-1 *:basis-1/4 *:justify-center" />
			</PieChart>
		</ChartContainer>
	);
}
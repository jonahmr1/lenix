import { Crown, Crosshair, Skull, Award, ChartNoAxesCombined } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { entries } from '@lenix/lenix'
import { onEvent } from "lenix/nui";
import type { Events } from "types";

export const TopScore = () => {
	const [coords, setCoords] = useState<Events['updateTopscoreCoords']['1']['0']>({
		left: 232,
		bottom: 24,
		scale: 1,
	} satisfies CSSProperties)

	const topScorers = {
		1: {
			name: 'Lenix',
			avatar: "https://lenix.dev/favicon-light.svg",
			stats: {
				kills: 15,
				deaths: 3,
				wins: 15,
				kd: 5
			}
		},
	}

	const stats = {
		kills: {
			label: "KILLS",
			icon: Crosshair,
		},
		deaths: {
			label: "DEATHS",
			icon: Skull,
		},
		wins: {
			label: "WINS",
			icon: Award,
		},
		kd: {
			label: "K/D",
			icon: ChartNoAxesCombined,
		},
	}

	useEffect(() => {
		const off = onEvent<Events['updateTopscoreCoords']>('topscore:updateCoords', setCoords)

		return off
	}, [])

	return (
		<div
			className="pointer-events-none absolute origin-bottom overflow-visible [container-type:size]"
			style={{
				bottom: coords.bottom,
				left: coords.left,
				height: 130 * coords.scale,
				width: 210 * coords.scale,
				transform: 'translateX(-50%)',
			}}
		>
			<section className="relative size-full overflow-visible rounded-xs bg-black/50 p-[3.1cqw]">
				<div className="absolute -left-[1.2cqw] -top-[1.2cqw] h-[12cqw] w-[12cqw] border-l-[1.1cqw] border-t-[1.1cqw] border-yellow-400 drop-shadow-[0_0_1cqw_rgb(250_204_21_/_0.75)]" />
				<div className="absolute -right-[1.2cqw] -top-[1.2cqw] h-[12cqw] w-[12cqw] border-r-[1.1cqw] border-t-[1.1cqw] border-yellow-400 drop-shadow-[0_0_1cqw_rgb(250_204_21_/_0.75)]" />
				<div className="absolute -bottom-[1.2cqw] -left-[1.2cqw] h-[12cqw] w-[12cqw] border-b-[1.1cqw] border-l-[1.1cqw] border-red-600 drop-shadow-[0_0_1cqw_rgb(220_20_38_/_0.75)]" />
				<div className="absolute -bottom-[1.2cqw] -right-[1.2cqw] h-[12cqw] w-[12cqw] border-b-[1.1cqw] border-r-[1.1cqw] border-red-600 drop-shadow-[0_0_1cqw_rgb(220_20_38_/_0.75)]" />
				<div className="relative z-10 flex h-full flex-col pb-2">
					<header className="flex h-[17.2%] shrink-0 items-center gap-[3.2cqw] pb-[2.65cqw]">
						<Crown className="size-[6.8cqw] fill-yellow-400 text-yellow-400 drop-shadow-[0_0_0.72cqw_rgb(250_204_21_/_0.55)]" />

						<div className="flex items-baseline gap-[2.6cqw] font-black uppercase italic tracking-normal">
							<span className="text-[5.6cqw] leading-none text-yellow-400 drop-shadow-[0_0.24cqw_0_rgb(120_80_0_/_0.5)]">
								1ST
							</span>
							<span className="text-[4.15cqw] leading-none text-white drop-shadow-[0_0.24cqw_0_rgb(0_0_0_/_0.55)]">
								PLACE
							</span>
						</div>
					</header>

					<div className="h-px shrink-0 bg-white/18" />

					<div className="grid flex-1 grid-cols-[20%_1fr] items-center gap-[4.8cqw] px-[3.1cqw] py-[2.9cqw]">
						<div className="aspect-square w-full overflow-hidden rounded-full border-[0.32cqw] border-red-600 bg-black shadow-[0_0_1.32cqw_rgb(220_20_38_/_0.28)]">
							<img
								src={topScorers[1].avatar}
								alt=""
								className="size-full object-cover grayscale"
							/>
						</div>

						<div className="min-w-0 uppercase tracking-normal">
							<h2 className="truncate text-[7.15cqw] font-black leading-none text-white drop-shadow-[0_0.3cqw_0_rgb(0_0_0_/_0.58)]">
								{topScorers[1].name}
							</h2>
							<p className="text-[10px] text-white/66">ID: 67</p>
						</div>
					</div>

					<div className="h-px shrink-0 bg-white/18 my-1" />

					<div className="grid h-[36.5%] shrink-0 grid-cols-4 gap-[2.35cqw]">
						{entries(topScorers[1].stats).map(([key, value]) => {
							const Icon = stats[key].icon
							return (
								<div
									key={key}
									className="relative flex min-h-0 flex-col items-center justify-center overflow-visible rounded-[0.48cqw] bg-[#080d12]/72 gap-1 text-center shadow-[inset_0_0_2cqw_rgb(255_255_255_/_0.025)]"
								>
									<div className="absolute -left-[0.45cqw] -top-[0.45cqw] h-[3.8cqw] w-[3.8cqw] border-l-[0.45cqw] border-t-[0.45cqw] border-yellow-400 drop-shadow-[0_0_0.45cqw_rgb(250_204_21_/_0.7)]" />
									<div className="absolute -right-[0.45cqw] -top-[0.45cqw] h-[3.8cqw] w-[3.8cqw] border-r-[0.45cqw] border-t-[0.45cqw] border-yellow-400 drop-shadow-[0_0_0.45cqw_rgb(250_204_21_/_0.7)]" />
									<div className="absolute -bottom-[0.45cqw] -left-[0.45cqw] h-[3.8cqw] w-[3.8cqw] border-b-[0.45cqw] border-l-[0.45cqw] border-red-600 drop-shadow-[0_0_0.45cqw_rgb(220_20_38_/_0.7)]" />
									<div className="absolute -bottom-[0.45cqw] -right-[0.45cqw] h-[3.8cqw] w-[3.8cqw] border-b-[0.45cqw] border-r-[0.45cqw] border-red-600 drop-shadow-[0_0_0.45cqw_rgb(220_20_38_/_0.7)]" />
									<div className="relative z-10 gap-0.5 flex flex-col items-center">
										<Icon
											className="size-[5.7cqw] text-white/56 drop-shadow-[0_0.24cqw_0_rgb(0_0_0_/_0.42)]"
										/>

										<div className="text-[2.05cqw] font-black uppercase leading-none text-white/60 drop-shadow-[0_0.18cqw_0_rgb(0_0_0_/_0.52)]">
											{stats[key].label}
										</div>
									</div>

									<div className="relative z-10 text-[4.6cqw] leading-none font-black text-white drop-shadow-[0_0.24cqw_0_rgb(0_0_0_/_0.56)]">
										{value}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</section>
		</div>
	);
};

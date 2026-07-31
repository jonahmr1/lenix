import { Crown, Crosshair, Skull, Award, ChartNoAxesCombined } from "lucide-react";
import type { CSSProperties } from "react";
import { entries } from '@lenix/lenix'

export const TopScore = () => {
	const frameStyle = {
		left: 32,
		top: 24,
		width: 380 / 1,
		height: 280 / 1,
	} satisfies CSSProperties;

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
			label: "K/D Ratio",
			icon: ChartNoAxesCombined,
		},
	}

	return (
		<div
			className="pointer-events-none absolute origin-top-left overflow-hidden [container-type:size]"
			style={frameStyle}
		>
			<section className="relative border-l-5 size-full overflow-hidden rounded-xs border-[0.12cqw] border-red-600/85 bg-[#070b0f]/86 p-[3.1cqw] shadow-[inset_0_0_4.8cqw_rgb(255_255_255_/_0.035),0_0_1.6cqw_rgb(220_20_38_/_0.18)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_68%_26%,rgb(255_255_255_/_0.07),transparent_18%),radial-gradient(circle_at_22%_78%,rgb(46_134_171_/_0.08),transparent_24%)] before:opacity-90">
				<div className="relative z-10 flex h-full flex-col">
					<header className="flex h-[17.2%] shrink-0 items-center gap-[3.2cqw] pb-[2.65cqw]">
						<Crown className="size-[6.8cqw] fill-red-600 text-red-600 drop-shadow-[0_0_0.72cqw_rgb(220_20_38_/_0.45)]" />

						<div className="flex items-baseline gap-[2.6cqw] font-[Syncopate] font-black uppercase italic tracking-normal">
							<span className="text-[5.6cqw] leading-none text-red-600 drop-shadow-[0_0.24cqw_0_rgb(90_0_8_/_0.48)]">
								1ST
							</span>
							<span className="text-[4.15cqw] leading-none text-white drop-shadow-[0_0.24cqw_0_rgb(0_0_0_/_0.55)]">
								PLACE
							</span>
						</div>
					</header>

					<div className="h-px shrink-0 bg-white/18" />

					<div className="grid flex-1 grid-cols-[25%_1fr] items-center gap-[4.8cqw] px-[3.1cqw] py-[3.9cqw]">
						<div className="aspect-square w-full overflow-hidden rounded-full border-[0.32cqw] border-red-600 bg-black shadow-[0_0_1.32cqw_rgb(220_20_38_/_0.28)]">
							<img
								src={topScorers[1].avatar}
								alt=""
								className="size-full object-cover grayscale"
							/>
						</div>

						<div className="min-w-0 font-[Syncopate] uppercase tracking-normal">
							<h2 className="truncate text-[7.15cqw] font-black leading-none text-white drop-shadow-[0_0.3cqw_0_rgb(0_0_0_/_0.58)]">
								{topScorers[1].name}
							</h2>
						</div>
					</div>

					<div className="h-px shrink-0 bg-white/18" />

					<div className="grid h-[36.5%] shrink-0 grid-cols-4 gap-[2.35cqw] py-[2.2cqw]">
						{entries(topScorers[1].stats).map(([key, value]) => {
							const Icon = stats[key].icon
							return (
								<div
									key={key}
									className="flex min-h-0 flex-col items-center justify-center rounded-[0.48cqw] border-[0.1cqw] border-red-600/90 bg-[#080d12]/72 px-[1.65cqw] text-center shadow-[inset_0_0_2cqw_rgb(255_255_255_/_0.025)]"
								>
									<Icon
										className="mb-[1.45cqw] size-[5.7cqw] text-white/56 drop-shadow-[0_0.24cqw_0_rgb(0_0_0_/_0.42)]"
									/>

									<div className="font-[Syncopate] text-[2.05cqw] font-black uppercase leading-none text-white/60 drop-shadow-[0_0.18cqw_0_rgb(0_0_0_/_0.52)]">
										{stats[key].label}
									</div>

									<div className="mt-[1.8cqw] font-[Syncopate] text-[4.6cqw] leading-none text-white drop-shadow-[0_0.24cqw_0_rgb(0_0_0_/_0.56)]">
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

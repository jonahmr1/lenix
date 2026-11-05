import { entries } from "@lenix/lenix"

const array = [
	{
		label: 'Tables',
		importance: 30,
	},
	{
		label: 'Chairs',
	},
	{
		label: 'TVs',
		importance: 6,
	},
]

type IWeatherStatus = 'sunny' | 'rainy' | 'snowy'

const status: Record<IWeatherStatus, string> = {
	sunny: "Climat ensoleille aujourd'hui O",
	rainy: 'Il pleut',
	snowy: 'Il neige',
}

const WeatherStatus = ({ weather } : { weather: IWeatherStatus | undefined }) => (
	<p>{weather ? status[weather] : 'Meteo unconnu'}</p>
)

export default () => (
	<div className="h-screen w-full flex flex-col items-center justify-center">
		<div>
			<h1>Packing List</h1>
			<ul>
				{array.map(({ label, importance }) => (
					<li key={label}>{label} {importance && `(Importance: ${importance})`}</li>
				))}
			</ul>
		</div>
		<br />
		<div>
			{entries(status).map(([weather]) => <WeatherStatus key={weather} {...{ weather }} />)}
		</div>
	</div>
)
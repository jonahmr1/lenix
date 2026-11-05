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
export default () => (
	<div className="h-screen w-full flex items-center justify-center">
		<div>
			<h1>Packing List</h1>
			<ul>
				{array.map(({ label, importance }) => (
					<li key={label}>{label} {importance && `(Importance: ${importance})`}</li>
				))}
			</ul>
		</div>
	</div>
)
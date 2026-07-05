export default () => {
	return (
		<div className="w-full flex items-end h-full justify-end py-10">
			<input className="absolute top-3/7 left-1/2 -translate-x-1/2 bg-green-500 max-w-1/3 h-10" type="number" name="freq" id="freq" title="Channel Frequency" />
			<button className="absolute top-58/100 left-1/2 -translate-x-1/2 cursor-pointer hover:bg-gray-800 w-5 h-3" title="Turn On/Off The Radio"></button>
			<img className="max-h-100 border border-white" src="/radio.png" />
		</div>
	)
}
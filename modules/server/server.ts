export const server: {
	entity: {
		handle: (netId: number) => number;
		handleFromSource: (source: number) => number;
	};
} = {
	entity: {
		handle: (netId: number) => NetworkGetEntityFromNetworkId(netId),
		handleFromSource: (source: number) => GetPlayerPed(source.toString())
	}
}
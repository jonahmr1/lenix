async function isPlayerCloseEnough() {
  const closestVehicleHandle = await lib.closestVehicle(PlayerPedId(), 10.0)
  if (!closestVehicleHandle) {
    Bridge.notify('Could not find the vehicle you are trying to return, try to get closer to it', 'error')
    return;
  }
  return closestVehicleHandle
}

async function returnVehicle(NetIdsRequested) {
  const closestVehicleHandle = await lib.closestVehicle(PlayerPedId(), 10.0)
  const [closestVehicleNetId, _] = await lib.awaitNetworkExisting(null, closestVehicleHandle)
  const response = await exports.tr_kit.clearCreatedVehicle(closestVehicleNetId)
  if (!response) {
    Bridge.notify('Failed to return the vehicle, please try again later', 'error')
    return;
  }
  NetIdsRequested.splice(NetIdsRequested.indexOf(closestVehicleNetId), 1)
  Bridge.notify('Vehicle returned successfully', 'success')
}

onNet('lenix_vehicle:client:addReturnOption', (netId, proccessedItems) => {
  NetIdsRequested.unshift(netId)
  if (proccessedItems.clearOnLeave) {
    let wasInVehicle = lib.isInVehicle();
    const interval = setInterval(() => {
      const isInVehicle = lib.isInVehicle();
      if (wasInVehicle && !isInVehicle) {
        exports.tr_kit.clearCreatedVehicle(netId);
        const netIdIndex = NetIdsRequested.indexOf(netId);
        if (netIdIndex !== -1) NetIdsRequested.splice(netIdIndex, 1);
        clearInterval(interval);
      }
      wasInVehicle = isInVehicle;
    }, 1000);
  }
})
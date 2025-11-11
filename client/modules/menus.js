let Menu = {}
function IsZoneFree(zone) {
  const response = lib.isZoneFree({ coords: zone, radius: 3.5 })
  return response
}

async function isPlayerAllowed(processedItem) {
  const allowedTargets = processedItem.allowed
  const disallowedTargets = processedItem.disallowed
  let isAllowed = false
  
  const inAllowList = await lib.callback.await('isPlayerInAllowList', null, allowedTargets)
  const notInDisallowList = await lib.callback.await('isPlayerNotInDisallowedList', null, disallowedTargets)

  if (notInDisallowList) {
    isAllowed = inAllowList ? true : false
  }
  return isAllowed
}
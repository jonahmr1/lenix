let Menu = {}
function IsZoneFree(zone) {
  const response = lib.isZoneFree({ coords: zone, radius: 3.5 })
  return response
}
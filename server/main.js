let isPreviewSessionBusy = false

function generatePlate(plateArray) {
  const plateString = plateArray[0]
  const plateMinimumInteger = plateArray[1]
  const plateMaximumInteger = plateArray[2]
  return `${plateString}${Math.floor(Math.random() * (plateMaximumInteger - plateMinimumInteger + 1)) + plateMinimumInteger}`
}

lib.callback.register('sessionStatus', (_) => {
  return isPreviewSessionBusy
})

onNet('lenix_vehicles:server:setPreviewSessionBusy', function(status) {
  isPreviewSessionBusy = status
  if (isPreviewSessionBusy) {
    on("playerDropped", () => {
      if (source === global.source) {
        isPreviewSessionBusy = false
      }
    })
  }
})
import onNuiCallback from "../nuiCallback/onNuiCallback"

onNuiCallback<[boolean, boolean]>('__nuiFocus', (data, callback) => {
  SetNuiFocus(data?.[0] || false, data?.[1] || false)
  callback(true)
})
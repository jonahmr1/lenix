import onNuiCallback from "../nuiCallback/onNuiCallback";

onNuiCallback<[boolean, boolean]>('__nuiFocus', (data, callback) => {
  SetNuiFocus(data[0], data[1])
  callback(true)
})
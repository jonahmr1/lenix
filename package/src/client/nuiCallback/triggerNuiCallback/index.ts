export default (name: string, ...params: any[]) => 
  SendNuiMessage(JSON.stringify({ __name: name, params }))
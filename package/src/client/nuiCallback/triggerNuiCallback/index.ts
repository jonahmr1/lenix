export default (endpoint: string, ...parameters: any[]) => 
  SendNuiMessage(JSON.stringify({ __name: endpoint, params: parameters }))
export const triggerNuiCallback = async <T = unknown>(
  callbackEnpoint: string, 
  dataObject?: object
): Promise<T> => {
  const response = await fetch(`https://${GetParentResourceName()}/${callbackEnpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(dataObject || {}),
  })
  return await response.json()
}
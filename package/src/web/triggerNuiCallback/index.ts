export default async <T = unknown>(
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
  try {
    return await response.json()
  } catch (error) {
    throw console.error(error)
  }
}
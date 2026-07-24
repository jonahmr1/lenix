export default async <T = unknown>(
  endpoint: string, 
  parameters?: object
): Promise<T> => {
  try {
    const response = await fetch(`https://${GetParentResourceName()}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(parameters || {}),
    })
    return await response.json()
  } catch(error) {
    throw new Error(
      `nui callback invoke was not ok, was the endpoint '${endpoint}' already defined before the invoke?
      learn more: ${error}`
    )
  }
}
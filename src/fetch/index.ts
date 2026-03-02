export const safeRequest = async (domain: string, endpoint: string, request: RequestInit) => {
  try {
    return await fetch(`https://${domain}/${endpoint}`, request)
  } catch(error) {
    throw new Error('An error occurred while making the request.', { cause: error })
  } finally {
    console.log(`End of ${domain}${endpoint} request`)
  }
}
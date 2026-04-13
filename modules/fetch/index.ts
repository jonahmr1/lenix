/**
 * A wrapper for fetch that throws an error if the request fails.
 * @param domain - domain of the URL (e.g. api.github.com)
 * @param endpoint - endpoint of the URL (e.g. users/lenixdev)
 * @param request - request options (e.g. { method: 'GET' })
 */
export const caughtFetch = async (
	domain: string,
	endpoint: string,
	request?: RequestInit,
): Promise<Response> => {
	try {
		return await fetch(`https://${domain}/${endpoint}`, request)
	} catch (error) {
		throw new Error('An error occurred while making the request.', {
			cause: error,
		})
	} finally {
		console.debug(`End of ${domain}/${endpoint} request`)
	}
}

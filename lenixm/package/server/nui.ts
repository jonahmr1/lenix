import { asserts } from "@lenix/lenix";
import { NuiFetchGeneric } from "../shared";

const clientRequests: string[] = []

export const onNuiServer = <T extends NuiFetchGeneric>(
	id: T[1],
	cb: (client: number, data: T[2]) => T[0] | Promise<T[0]>
) => {
	asserts(!clientRequests.includes(id), `server nui<${id}> is already defined`)

  clientRequests.push(id)

  onNet(`lenix/nui:${id}`, async(requestId: number, parameters: Parameters<typeof cb>[1]) => {
    const clientSource = source

    try {
      const result = await cb(clientSource, parameters)
      emitNet(`lenix/nui:${id}`, clientSource, requestId, result)
    } catch (error) {
      emitNet(`lenix/nui:${id}`, clientSource, requestId)
			throw error
		}
  })
}
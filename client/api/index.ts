import { triggerPromise } from '@trippler/tr_lib/client'
import { openDesk } from '../modules'
import { Types } from '../../shared/types'

export const isSelfInteraction = async (citizenid: string) => {
  return await triggerPromise<Types["IsSelfInteraction"]>('lenix_bossdesk:server:isSelfInteraction', citizenid)
}

export const notify = (...parameters: unknown[]) => exports.qbx_core.Notify(...parameters)

onNet('lenix_bossdesk:client:openDesk', openDesk)

exports('OpenDesk', openDesk)
import type { Request } from '../shared/types'
import { fetchNui } from './fetch'

fetchNui<Request<null, '__nuiInit'>>('__nuiInit', {})
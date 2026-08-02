import { ResourceContext, ResourceName } from './resource'
import Config from './config'
import Locale from './locale'

if (Config.PrintMessage) {
	const message = Locale(`starting.${ResourceContext}`, ResourceName)
	console.log(message)
}
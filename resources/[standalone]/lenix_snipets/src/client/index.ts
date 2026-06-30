import { addRadialItem, notify } from "@overextended/ox_lib/client"

interface Ped {
	model: string
	coords: [number, number, number, number]
}

const PEDS: Ped[] = []

// exports.ox_target.addEntity(netIds, options)

addRadialItem([
  {
    id: 'police',
    label: 'Police',
    icon: 'shield-halved',
		onSelect: () => {
			notify({
				title: 'ابو داحم'
			})
		}
  },
  {
    id: 'business_stuff',
    label: 'Business',
    icon: 'briefcase',
    onSelect: () => {
			notify({
				title: 'Lenix!'
			})
    }
  }
])
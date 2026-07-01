import { addRadialItem, notify } from "@overextended/ox_lib/client"

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
import { addRadialItem, disableRadial, notify, removeRadialItem } from "@overextended/ox_lib/client"

const police = [
  {
    id: 'plist',
    label: 'Police List',
    icon: 'list-ul',
    onSelect: () => {
			notify({
				title: 'Not available yet!'
			})
    }
  },
]

addRadialItem([
  {
    id: 'reload',
    label: 'Reload',
    icon: 'shirt',
		onSelect: () => emit('illenium-appearance:client:reloadSkin')
  },
  {
    id: 'escort',
    label: 'Escort',
    icon: 'user-group',
    onSelect: () => {
			emit('ox:useEscort')
    }
  },
  {
    id: 'put-in-vehicle',
    label: 'Put in vehicle',
    icon: 'arrow-right-from-bracket',
    onSelect: () => {
			notify({
				title: 'Not available yet!'
			})
    }
  },
  {
    id: 'take-out-vehicle',
    label: 'Take out of vehicle',
    icon: 'arrow-right-to-bracket',
    onSelect: () => {
			notify({
				title: 'Not available yet!'
			})
    }
  },
  {
    id: 'emote',
    label: 'Emotes',
    icon: 'person-walking',
    onSelect: () => {
			notify({
				title: 'Not available yet!'
			})
    }
  },
])

onNet('ox:setGroup', (groupName: string, _grade: number) => {
  if (groupName === 'police') addRadialItem(police)
	else removeRadialItem('plist')
});
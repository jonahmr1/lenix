import { hideContext, inputDialog, registerContext, showContext } from '@overextended/ox_lib/client'
import { CHARACTER_SLOTS } from './config'
import type { Character } from '@overextended/ox_core'

function getIcon(gender: string) {
  if (gender === 'male') return 'mars'
  if (gender === 'female') return 'venus'
  return 'genderless'
}

function getGenderLabel(gender: string) {
  if (gender === 'male') return 'Male'
  if (gender === 'female') return 'Female'
  return 'Non-Binary'
}

function buildCharSelect(characters: Character[]) {
	const options: Extract<
		Parameters<typeof registerContext>[0],
		{ options: unknown }
	>["options"] = [];

  for (const char of characters) {
    options.push({
      title: `${char.firstName} ${char.lastName}`,
      description: `${getGenderLabel(char.gender)} · Last played: ${char.lastPlayed || 'Never'}`,
      icon: getIcon(char.gender),
      arrow: true,
      onSelect: () => {
        hideContext(false)
        emitNet('ox:setActiveCharacter', char.charId)
      },
    })
  }

  if (characters.length < CHARACTER_SLOTS) {
    options.push({
      title: 'Create Character',
      description: 'Create a new character to enter Los Santos',
      icon: 'plus',
      onSelect: async () => {
        const input = await inputDialog('Create Character', [
          { type: 'input', required: true, icon: 'user-pen', label: 'First Name', placeholder: 'John' },
          { type: 'input', required: true, icon: 'user-pen', label: 'Last Name', placeholder: 'Smith' },
          {
            type: 'select', required: true, icon: 'circle-user', label: 'Gender',
            options: [
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Non-Binary', value: 'non_binary' },
            ],
          },
          {
            type: 'date', required: true, icon: 'calendar-days', label: 'Date of Birth',
            format: 'YYYY-MM-DD', min: '1900-01-01', max: '2006-01-01', default: '2006-01-01',
          },
        ], { allowCancel: true })

        if (!input) return

        hideContext(false)
        emitNet('ox:setActiveCharacter', {
          firstName: input[0] as string,
          lastName: input[1] as string,
          gender: input[2] as string,
          date: input[3] as number,
        })
      },
    })
  }

  registerContext({
    id: 'lenix_charselect',
    title: 'Select Character',
    canClose: false,
    options,
  })
}

onNet('ox:startCharacterSelect', (_userId: number, characters: Character[]) => {
  buildCharSelect(characters)
  showContext('lenix_charselect')
})

onNet('ox:setActiveCharacter', () => {
  hideContext(false)
})

on('onResourceStop', (resource: string) => {
	console.debug('stop', resource)
	if (GetCurrentResourceName() !== resource) return
	emitNet('ox:playerLogout');
})

on('onResourceStart', (resource: string) => {
	console.debug('started', resource)
	if (GetCurrentResourceName() !== resource) return
	emitNet('ox:playerJoined');
})

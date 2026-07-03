import('./groups');
import('./prison');
import('./medical');
import('./cuffs');
import('./escort')
import('./interactions')

on('ox:createdCharacter', async (playerId: number) => {
	exports.ox_inventory.AddItem(playerId, 'money', 5000)
})
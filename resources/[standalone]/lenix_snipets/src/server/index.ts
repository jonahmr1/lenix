import('./groups');
import('./prison');
import('./medical');
import('./cuffs');
import('./escort')
import('./interactions')
import('./hotel')

on('ox:createdCharacter', async (playerId: number) => {
	exports.ox_inventory.AddItem(playerId, 'money', 5000)
})
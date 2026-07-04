return {
	General = {
		name = 'Shop',
		blip = {
			id = 59, colour = 69, scale = 0.8
		}, inventory = {
			{ name = 'burger', price = 10 },
			{ name = 'water', price = 10 },
			{ name = 'cola', price = 10 },
		}, locations = {
		}, targets = {
		}
	},

	Liquor = {
		name = 'Liquor Store',
		blip = {
			id = 93, colour = 69, scale = 0.8
		}, inventory = {
			{ name = 'water', price = 10 },
			{ name = 'cola', price = 10 },
			{ name = 'burger', price = 15 },
		}, locations = {
		}, targets = {
		}
	},

	YouTool = {
		name = 'YouTool',
		blip = {
			id = 402, colour = 69, scale = 0.8
		}, inventory = {
			{ name = 'phone', price = 500 },
			{ name = 'radio', price = 250 },
			{ name = 'cuffs', price = 650 },
		}, locations = {
			vec3(46.9020, -1749.5176, 29.6323),
		}, targets = {
			{ loc = vec3(2746.8, 3473.13, 55.67), length = 0.6, width = 3.0, heading = 65.0, minZ = 55.0, maxZ = 56.8, distance = 3.0 },
			{ loc = vec3(46.9020, -1749.5176, 29.6323), length = 3.0, width = 3.0, heading = 51.5492, minZ = 28.0, maxZ = 30.8, distance = 3.0 }
		}
	},

	Ammunation = {
		name = 'Ammunation',
		blip = {
			id = 110, colour = 69, scale = 0.8
		}, inventory = {
			{ name = 'ammo-9', price = 5, },
			{ name = 'ammo-45', price = 6, },
			{ name = 'armour', price = 200, },
			{ name = 'WEAPON_PISTOL50', price = 20000 },
			{ name = 'WEAPON_PISTOL_MK2', price = 2500 },
			{ name = 'WEAPON_HEAVYPISTOL', price = 3000 },
		}, locations = {
			vec3(22.56, -1109.89, 29.80),
		}, targets = {
			{ loc = vec3(23.68, -1106.46, 29.91), length = 0.6, width = 0.5, heading = 160.0, minZ = 29.8, maxZ = 30.2, distance = 2.0 },
		}
	},

	PoliceArmoury = {
		name = 'Police Armoury',
		groups = shared.police,
		blip = {
			id = 110, colour = 84, scale = 0.8
		}, inventory = {
			{ name = 'ammo-9', price = 1, metadata = { registered = true, serial = 'POL' }, },
			{ name = 'ammo-rifle', price = 1, metadata = { registered = true, serial = 'POL' }, },
			{ name = 'ammo-heavysniper', price = 1, metadata = { registered = true, serial = 'POL' }, },
			{ name = 'WEAPON_FLASHLIGHT', price = 1, metadata = { registered = true, serial = 'POL' }, },
			{ name = 'WEAPON_NIGHTSTICK', price = 1, metadata = { registered = true, serial = 'POL' }, },
			{ name = 'cuffs', price = 1, metadata = { registered = true, serial = 'POL' }, },
			{ name = 'radio', price = 1, metadata = { registered = true, serial = 'POL' }, },
			{ name = 'WEAPON_HEAVYSNIPER', price = 1, metadata = { registered = true, serial = 'POL' } },
			{ name = 'WEAPON_HEAVYRIFLE', price = 1, metadata = { registered = true, serial = 'POL' } },
			{ name = 'WEAPON_PISTOL', price = 1, metadata = { registered = true, serial = 'POL' } },
			{ name = 'WEAPON_CARBINERIFLE', price = 1, metadata = { registered = true, serial = 'POL' } },
			{ name = 'WEAPON_STUNGUN', price = 1, metadata = { registered = true, serial = 'POL'} },
		}, locations = {
			vec3(451.51, -979.44, 30.68),
			vec3(468.2743, -1008.7762, 30.7109),
		}, targets = {
			{ loc = vec3(453.21, -980.03, 30.68), length = 0.5, width = 3.0, heading = 270.0, minZ = 30.5, maxZ = 32.0, distance = 6 },
			{ loc = vec3(468.2743, -1008.7762, 30.7109), length = 0.5, width = 3.0, heading = 246.4373, minZ = 29.5, maxZ = 31.0, distance = 6 },
		}
	},

	Medicine = {
		name = 'Medicine Cabinet',
		blip = {
			id = 403, colour = 69, scale = 0.8
		}, inventory = {
			{ name = 'medkit', price = 26 },
			{ name = 'bandage', price = 5 }
		}, locations = {
			vec3(-308.4312, -588.7435, 32.7768),
		}, targets = {
			{ loc = vec3(-308.4312, -588.7435, 32.7768), length = 3.0, width = 3.0, heading = 129.6555, minZ = 31.7768, maxZ = 33.7768, distance = 3.0 }
		}
	},

	BlackMarketArms = {
		name = 'Black Market (Arms)',
		inventory = {
			{ name = 'WEAPON_DAGGER', price = 5000, metadata = { registered = false	}, currency = 'black_money' },
			{ name = 'WEAPON_CERAMICPISTOL', price = 50000, metadata = { registered = false }, currency = 'black_money' },
			{ name = 'at_suppressor_light', price = 50000, currency = 'black_money' },
			{ name = 'ammo-rifle', price = 1000, currency = 'black_money' },
			{ name = 'ammo-rifle2', price = 1000, currency = 'black_money' }
		}, locations = {
		}, targets = {
		}
	},

	VendingMachineDrinks = {
		name = 'Vending Machine',
		inventory = {
			
		},
		model = {
			`prop_vend_soda_02`, `prop_vend_fridge01`, `prop_vend_water_01`, `prop_vend_soda_01`
		}
	}
}

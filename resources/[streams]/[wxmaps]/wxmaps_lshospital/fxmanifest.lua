--- Decrypted by Eden

fx_version 'cerulean'
games {'gta5'}

author 'wolvezx - wxmaps team'
description 'Los Santos Medical Center, for support join our discord https://discord.gg/sSR2M8c78v'
version '1.0.3'

this_is_a_map "yes"

lua54 'yes'

files {
	'audio/wx_lshospital_doors_game.dat151.rel',
	'audio/wx_lshospital_oneocc_game.dat151.rel',
	'audio/wx_lshospital_twoocc_game.dat151.rel'
}




escrow_ignore {
	'stream/TXDs/*',
	'stream/GTA/*',
	'stream/Exterior/wx_hospital_ext_building_sign.ydr',
	'stream/Exterior/wx_hospital_lobby_sign.ydr'
}

data_file 'AUDIO_GAMEDATA' 'audio/wx_lshospital_doors_game.dat'
data_file 'AUDIO_GAMEDATA' 'audio/wx_lshospital_oneocc_game.dat'
data_file 'AUDIO_GAMEDATA' 'audio/wx_lshospital_twoocc_game.dat'

dependency 'wxmaps_commons'
dependency 'wxmaps_lshospital_v'
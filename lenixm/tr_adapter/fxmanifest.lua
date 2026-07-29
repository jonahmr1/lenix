fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Trippler Scripts'
version '0.91.0'
dependency 'tr_lib'

shared_script 'init.lua'
server_scripts {
    'modules/print/shared.lua',
    'modules/require/shared.lua',
    'order/server.lua',
    'converter/server.lua',
    'calls/server.lua',
    'mapper/server.lua',
    'env/server.lua',
    'adapter/server.lua',
    'scripts/server.lua',
    'exceptions/server.lua',
    'categories/server.lua',
    'loader/server.lua',
    -- this will edit your fxmanifest providing the scripts that are missing automatically :)
    'provider/server.lua',
    -- this will filter the supported resources names that are:
    -- missing | stored in ScriptsToSupport
    -- will be provided by the tr_adapter | stored in AvailableScripts
    -- provided by another script | ignored
    'selector/server.lua',
    -- this will import the names of all resources that are located in /compatibilities/ folder
    -- store the category and name of the resource in a table
    'extractor/server.lua',
    -- this will grab the names of all resources that are installed in the server
    -- store the detected resources names from the server in a table
    'finder/server.lua',
}
files {
    'compatibilities/inventory/_exception/server.lua',
    'compatibilities/inventory/ox_inventory/server.lua',
    'compatibilities/inventory/qb-inventory/server.lua',
}
provide 'ox_inventory'

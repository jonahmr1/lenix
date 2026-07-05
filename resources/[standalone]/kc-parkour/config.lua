--[[LoRo Store
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
https://discord.gg/EZTU8DURnP
]]
Config                                      = Config or {}

-- Blacklist
Config.BlacklistedProps = {
    -- ['prop_fnclink_05c'] = true, -- Those are examples
    -- ['prop_fnclink_10a'] = true, -- Those are examples
}
-- You can blacklist props to avoid players doing parkour on them (Example: Spiked fences, prison wall)

-- Base
Config.HealthCheck                          = 8                     -- How many health should be removed from the player for him to stop & ragdoll while doing a parkour move or grabbing onto a ledge? (The default value is 8)
Config.TackledRagdollForce                  = 12                    -- How much force the player should be tackled with (The default value is 12)
Config.TackledRagdollTime                   = 2.0                   -- How long will the player be ragdoll if he is been slide tackled (In seconds) (The default value is 2.0)
Config.AllRagdollTime                       = 2.5                   -- How long will the player be ragdoll if the move is cancelled (In seconds) (The default value is 2.5)
Config.SlideRagdollTime                     = 1.8                   -- How long will the player be ragdoll if the slide is cancelled (In seconds) (The default value is 1.8)
Config.SlideCooldownTime                    = 5.0                   -- How long will the player has to wait before being able to slide again (In seconds) (The default value is 5.0)
Config.SlideShouldRagdoll                   = true                  -- Should the player ragdoll when the slide is cancelled? (The default value is true)
Config.ObstacleShouldRagdoll                = true                  -- Should the player ragdoll when an obstacle is detected during a move? (The default value is true)
Config.TimeToParkour                        = 0                     -- Time after the button press to parkour in seconds, if set to 0 the script will try to parkour until the player press the parkour button again (The default value is 0)
-- You can also set 'Config.TimeToParkour' to -1 if you want the parkour to be a on/off state, which will let you parkour until you press the keybind again to stop (If not stopped by anything else)

-- Sit Key Config
Config.ParkourCommandTitle                  = 'Initiate Parkour'    -- Key title in GTA 5 control settings
Config.ParkourCommandInputMapper            = 'KEYBOARD'            -- Input Mapper
Config.ParkourCommandInputParameter         = 'Z'                   -- Tasto parkour
Config.ParkourCommandName        		    = 'parkour'             -- If you ever feel the need to change the command name, here's the option for it
Config.SlideCommandTitle                    = 'Slide Key'           -- Key title in GTA 5 control settings
Config.SlideCommandInputMapper              = 'KEYBOARD'            -- Input Mapper
Config.SlideCommandInputParameter           = 'X'                   -- Tasto slide
Config.SlideCommandName        		        = 'parkourslide'        -- If you ever feel the need to change the command name, here's the option for it

-- Sync
Config.SendToAllPlayers                     = false                 -- Should the event be sent to all players or only 'active' physical players known to the client? (I recommend setting this to false if you have a 30+ player server, but it may result in worse sync for far away players)

-- List
--- For each category they are sorted from slowest to fastest. This list allow you to able/disable certain moves.
Config.MoveList                             = {
    ['vault small'] = { -- (There will be more move coming soon don't worry)
        [1] = {         -- Safety Vault
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
        [2] = {         -- Monkey Vault
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
        [3] = {         -- Thief Vault
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
        [4] = {         -- Revers Vault
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
        [5] = {         -- Jump Vault
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
        [6] = {         -- Speed Vault
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
    },
    ['vault medium'] = { -- (There will be more move coming soon don't worry)
        [1] =  {        -- Slide Vault
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
        [2] =  {        -- Kash Vault
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
        [3] =  {        -- Roll Vault
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
    },
    ['vault long'] = {
        [1] =  {        -- Kong Double Vault
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
    },
    ['vault ledge'] = {
        [1] =  {
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
    },
    ['vault over'] = { -- (There will be more move coming soon don't worry)
        [1] =  {
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
    },
    ['wall small'] = { -- SET THEM BOTH TO THE SAME VALUE!!! EITHER 'true' OR 'false'!! (There will be more move coming soon don't worry)
        [1] =  {
            ["enabled"] = true,     -- SET THEM BOTH TO THE SAME VALUE!!!
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
        [2] =  {
            ["enabled"] = true,     -- SET THEM BOTH TO THE SAME VALUE!!!
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
    },
    ['wall medium'] = {
        [1] =  {
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
    },
    ['wall long'] = {
        [1] =  {
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
    },
    ['ledge up'] = { -- (There will be more move coming soon don't worry)
        [1] =  {
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
    },
    ['ledge move'] = { -- (There will be more move coming soon don't worry)
        [1] =  {
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
    },
    ['slide'] = {
        [1] =  {
            ["enabled"] = true,
            ["cost"]    = 1,
            ["reward"]  = 1,
        },
    },
}

-- Parameters
Config.MediumWallValue                      = 2.7   	-- Height to consider using 'wall medium'
Config.HighWallValue                        = 4.0   	-- Height to consider using 'wall long'
-- I would advise to not change anything in this category, I've still left those options if anyone really need to modify such things.

-- Detection
Config.DetectWorld                          = true      -- This value determines whether the system should detect obstacles in the world (The default value is true)
Config.DetectProps                          = true      -- This value determines whether the system should detect obstacles on props (The default value is true)
Config.DetectVehicles                       = true     -- This value determines whether the system should detect obstacles on vehicles (The default value is false)
-- I would advise to not change anything in this category, I've still left those options if anyone really need to modify such things. Be aware of DetectVehicles, it doesn't work for every vehicles, thats why it's false by default!

-- Debug
Config.Debug        				        = false   	 -- Debug temporaneo: stampa in F8 il motivo se una mossa parkour viene bloccata
Config.DebugSpeed                           = 1.0        -- Slow down parkour (Only client-side, I would advise to not change it)

-- Misc
Config.Language						        = 'en'		 -- Currently Available: fr, en
Config.UpdateChecker                        = false      -- Set to false if you don't want to check for resource update on start (No need to change this if you're using fivem-checker)
Config.ChangeLog					        = false		 -- Set to false if you don't want to display the changelog if new version is find (No need to change this if you're using fivem-checker)

-- Custom condition

--- THIS SECTION HAS BEEN MOVED TO "client/custom_functions.lua"
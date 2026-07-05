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
-- Custom condition

---This function is called right after pressing the parkour move key
---@return boolean
function CanDoParkour()
    return true -- Example: "return GetSelectedPedWeapon(PlayerPedId()) == GetHashKey('weapon_unarmed')" or "return QBCore.Functions.GetPlayerData().job.name ~= 'police'"
end

---This function is called just before initating the parkour move
---@param name string
---@param number number
---@return boolean
function CanBeginParkour(name, number)
    return true -- Example: "return GetSelectedPedWeapon(PlayerPedId()) == GetHashKey('weapon_unarmed')" or "return QBCore.Functions.GetPlayerData().job.name ~= 'police'"
end

---This function is called right on the parkour move start
---@param name string
---@param number number
function ParkourBegin(name, number)
    -- Example:
    -- "SetCurrentPedWeapon(PlayerPedId(), GetHashKey('weapon_unarmed'), true)" - Once the move start, it will set the ped weapon to 'weapon_unarmed'
end

---This function is called right after the parkour move end
---@param name string
---@param number number
function ParkourEnd(name, number)
    -- Example:
    -- Could be used to give xp depending on "reward" from the MoveList (Config.MoveList[name][number]["reward"])
end

---Custom notification
---@param message string
---@param type number       0 refer to nothing special, 1 could refer to "success", 2 could refer to "error", 3 could refer to "in progress"
function ParkourNotification(message, type)
    local ShouldBeep = {
        [0] = false,
        [1] = true,
        [2] = true,
        [3] = false
    }

    -- DrawText2D(message, ShouldBeep[type])
end
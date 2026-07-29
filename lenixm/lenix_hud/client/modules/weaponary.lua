local config<const> = require 'shared/constants/index'
local api<const> = require 'client/api/weaponary/index'

local weaponary<const> = config.weaponary
local interval

local function updateWeapon()
  interval = SetInterval(function()
    local ped<const> = PlayerPedId()
    local _, weaponHash<const> = GetCurrentPedWeapon(ped, false)
    local _, ammo<const> = GetAmmoInClip(ped, weaponHash)
    local reserve<const> = GetAmmoInPedWeapon(ped, weaponHash)
    local clipSize<const> = GetWeaponClipSize(weaponHash)
    local fistImage<const> = weaponary.fistImage
    
    local weaponName = 'Unknown'
    local weaponImage = 'Undefined'
    local fxItemsData<const> = api.getFxItemsData()

    for itemName, item in pairs(fxItemsData) do
      if item.name and GetHashKey(item.name) == weaponHash then
        weaponName = item.label
        weaponImage = item.name == 'weapon_unarmed' and fistImage or ('nui://%s/%s'):format(weaponary.imagesPath, item.image)
        break
      end
    end

    lib.triggerNuiCallback('updateWeaponary', {
      name = weaponName,
      image = weaponImage,
      ammo = ammo,
      reserve = reserve - ammo,
      clipSize = clipSize,
      playerKills = api.getPlayerKills()
    })
  end, 90)
end

local function showWeaponary()
  lib.triggerNuiCallback('showWeaponary')
  updateWeapon()
end

local function hideWeaponary()
  lib.triggerNuiCallback('hideWeaponary')
  if interval then
    ClearInterval(interval)
    interval = nil
  end
end

return {
  showWeaponary = showWeaponary,
  hideWeaponary = hideWeaponary
}
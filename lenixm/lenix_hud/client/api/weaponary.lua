local weaponary<const> = require 'client/modules/weaponary'

local function getPlayerKills()
  local playerKills = 128
  return playerKills
end

local function getFxItemsData()
  return exports['qb-core']:GetCoreObject().Shared.Items
end

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
  weaponary.showWeaponary()
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
  weaponary.hideWeaponary()
end)

return {
  getPlayerKills = getPlayerKills,
  getFxItemsData = getFxItemsData
}
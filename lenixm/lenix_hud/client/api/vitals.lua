local vitals<const> = require 'client/modules/vitals'

local function getFxPlayerData()
  local QBCore<const> = exports['qb-core']:GetCoreObject()
  return QBCore.Functions.GetPlayerData()
end

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
  vitals.showVitals()
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
  vitals.hideVitals()
end)

return {
  getFxPlayerData = getFxPlayerData
}
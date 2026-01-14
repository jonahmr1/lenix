---@type boolean | nil
local isQboxCharactersHandlerDisabled<const> = require '@qbx_core/config/client'.characters.useExternalCharacters

exports('isQboxCharactersHandlerDisabled', function()
  return isQboxCharactersHandlerDisabled
end)

exports('lastCoords', function ()
  local playerData<const> = exports.qbx_core:GetPlayerData()
  if not playerData.position then return end
  return {
    x = playerData.position.x,
    y = playerData.position.y,
    z = playerData.position.z,
    w = playerData.position.w
  }
end)

exports('createNewCharacter' , function(timeout, data)
  local newData<const> = lib.callback.await('qbx_core:server:createCharacter', timeout, data)
  return newData
end)

exports('loadCharacter' , function(citizenId)
  lib.callback.await('qbx_core:server:loadCharacter', nil, citizenId)
end)

exports('getCharacterPreviewData' , function(citizenId)
  local clothes<const>, model<const> = lib.callback.await('qbx_core:server:getPreviewPedData', nil, citizenId)
  return clothes, model
end)

exports('getPlayerCharacters' , function(data)
  local characters<const>, _<const> = lib.callback.await('qbx_core:server:getCharacters')
  return characters
end)
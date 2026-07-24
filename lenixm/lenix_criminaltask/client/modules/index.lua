local bridge<const> = require 'client/api/index'
local config<const> = require 'shared/constants/index'

local isPlayerFree = true
local waypoint, prop

local function setPlayerStatus(state)
  isPlayerFree = state
end

local function randomInteractCoords()
  local index<const> = math.random(1, #config.taskCoords)
  return config.taskCoords[index]
end

local function createWayPoint()
  local coords<const> = randomInteractCoords()
  lib.assert(type(coords) == 'table' and #coords == 3, 'something went wrong')

	---@see ERROR, possibly could not find kit
  waypoint = kit.createBlip(vec3(coords[1], coords[2], coords[3]), config.settings.blipWaypoint.sprite)
  SetBlipColour(waypoint, config.settings.blipWaypoint.color.blip)
  SetBlipScale(waypoint, config.settings.blipWaypoint.scale)
  BeginTextCommandSetBlipName("STRING")
  AddTextComponentString(config.settings.blipWaypoint.label)
  EndTextCommandSetBlipName(waypoint)

  SetBlipRoute(waypoint, true)
  SetBlipRouteColour(waypoint, config.settings.blipWaypoint.color.route)
  return coords
end

local function createPackage(coords)
  local task<const> = config.settings.task
  local model<const> = task.propModel
  local target<const> = task.target
  lib.requestModel(GetHashKey(model))

  prop = CreateObject(GetHashKey(model), coords[1], coords[2], coords[3], true, true, false)
  SetEntityHeading(prop, 0.0)
  PlaceObjectOnGroundProperly(prop)
  SetEntityAsMissionEntity(prop, true, true)

  bridge.addLocalEntity(prop, target)
  return prop
end

local function takeTask()
  isPlayerFree = false
  local coords<const> = createWayPoint()
  prop = createPackage(coords)
  bridge.notify('Success', config.settings.task.notify.take, 'success')
end

local function abortTask()
  isPlayerFree = true
  if waypoint then RemoveBlip(waypoint) end
  bridge.notify('Error', config.settings.task.notify.abort, 'error')
  if prop then
    DeleteEntity(prop)
    bridge.removeLocalEntity(prop)
  end
  prop = nil
end

local function takeThePackage()
  local locale<const> = config.settings.task.notify
  local playerPed<const> = PlayerPedId()
  local dict<const> = "pickup_object"

  RequestAnimDict(dict)
  while not HasAnimDictLoaded(dict) do Wait(0) end

  TaskPlayAnim(playerPed, dict, "pickup_low", 1.5, 1.5, 1000, 49, 0, false, false, false)

  if bridge.progress(locale.progressBar) then
    ClearPedTasks(playerPed)
    local success, callback = lib.triggerPromise('lenix_criminiltasks:server:receiveItem')

    if not success or not callback.success then
      bridge.notify('Error', ('Something went wrong, Could not give item: %s'):format(callback and callback.error or 'Unknown'), 'error')
      return
    end

    lib.assert(callback.success == true, ('Failed to give %s, the reason: %s'):format(callback.item, callback.response))

    DeleteEntity(prop)
    bridge.notify(locale.title, locale.success, 'success')
    isPlayerFree = true
    RemoveBlip(waypoint)
  else
    ClearPedTasks(playerPed)
    bridge.notify(locale.canceled, locale.description, 'error')
  end
end

local function createPed(pedModel, pedCoords, pedScenario)
  lib.requestModel(GetHashKey(pedModel))

  local pedHandle = kit.createSinglePed({
    hash = GetHashKey(pedModel),
    coords = vec4(pedCoords[1], pedCoords[2], pedCoords[3] - 0.85, pedCoords[4]),
    behavior = {
      freeze = true,
      oblivious = true
    },
    scenario = {
      name = pedScenario,
      timeToLeave = 0,
      playIntroClip = true
    }
  })

  return pedHandle
end

return {
  isPlayerFree = function() return isPlayerFree end,
  setPlayerStatus = setPlayerStatus,
  takeTask = takeTask,
  abortTask = abortTask,
  takeThePackage = takeThePackage,
  createPed = createPed
}
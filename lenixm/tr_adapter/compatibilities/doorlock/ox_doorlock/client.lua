---@diagnostic disable: duplicate-set-field

Doorlock.ox_doorlock.UseClosestDoor = {
  label = 'useClosestDoor',
  args = {}
}

Doorlock.ox_doorlock.GetClosestDoor = {
  label = 'getClosestDoor',
  args = {},
  returns = {}
}

Doorlock.ox_doorlock.GetClosestDoorId = {
  label = 'getClosestDoorId',
  args = {},
  returns = {}
}

---@param entity number
Doorlock.ox_doorlock.GetDoorIdFromEntity = {
  label = 'getDoorIdFromEntity',
  args = {
    { name = 'entity' }
  },
  returns = {}
}

Doorlock.ox_doorlock.PickClosestDoor = {
  label = 'pickClosestDoor',
  args = {}
}
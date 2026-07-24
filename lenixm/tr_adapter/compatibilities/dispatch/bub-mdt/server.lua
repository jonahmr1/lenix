---@diagnostic disable: duplicate-set-field

Dispatch['bub-mdt'].CreateCall = {
  label = 'createCall',
  args = {
    { name = 'data' }
  },
  returns = {}
}

Dispatch['bub-mdt'].UpdateCallCoords = {
  label = 'updateCallCoords',
  args = {
    { name = 'callId' },
    { name = 'coords' }
  }
}

Dispatch['bub-mdt'].IsVehicleBOLO = {
  label = 'isVehicleBOLO',
  args = {
    { name = 'plate' }
  },
  returns = {}
}

Dispatch['bub-mdt'].UpdateProfileImage = {
  label = 'updateProfileImage',
  args = {
    { name = 'citizenId' },
    { name = 'image' }
  },
  returns = {}
}

Dispatch['bub-mdt'].CreateProfileCard = {
  label = 'createProfileCard',
  args = {
    { name = 'data' }
  }
}
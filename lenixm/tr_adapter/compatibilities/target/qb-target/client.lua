---@diagnostic disable: duplicate-set-field

Target['qb-target'].RaycastCamera = {
  label = 'RaycastCamera',
  args = {
    { name = 'flag' },
    { name = 'playerCoords' }
  },
  returns = {}
}

Target['qb-target'].DisableNUI = {
  label = 'DisableNUI',
  args = {}
}

Target['qb-target'].EnableNUI = {
  label = 'EnableNUI',
  args = {
    { name = 'options' }
  }
}

Target['qb-target'].LeftTarget = {
  label = 'LeftTarget',
  args = {}
}

Target['qb-target'].DisableTarget = {
  label = 'DisableTarget',
  args = {
    { name = 'forcedisable' }
  }
}

Target['qb-target'].DrawOutlineEntity = {
  label = 'DrawOutlineEntity',
  args = {
    { name = 'entity' },
    { name = 'bool' }
  }
}

Target['qb-target'].CheckEntity = {
  label = 'CheckEntity',
  args = {
    { name = 'flag' },
    { name = 'datatable' },
    { name = 'entity' },
    { name = 'distance' }
  }
}

Target['qb-target'].CheckBones = {
  label = 'CheckBones',
  args = {
    { name = 'coords' },
    { name = 'entity' },
    { name = 'bonelist' }
  },
  returns = {}
}

Target['qb-target'].AddCircleZone = {
  label = 'AddCircleZone',
  args = {
    { name = 'name' },
    { name = 'center' },
    { name = 'radius' },
    { name = 'options' },
    { name = 'targetoptions' }
  },
  returns = {}
}

Target['qb-target'].AddBoxZone = {
  label = 'AddBoxZone',
  args = {
    { name = 'name' },
    { name = 'center' },
    { name = 'length' },
    { name = 'width' },
    { name = 'options' },
    { name = 'targetoptions' }
  },
  returns = {}
}

Target['qb-target'].AddPolyZone = {
  label = 'AddPolyZone',
  args = {
    { name = 'name' },
    { name = 'points' },
    { name = 'options' },
    { name = 'targetoptions' }
  },
  returns = {}
}

Target['qb-target'].AddComboZone = {
  label = 'AddComboZone',
  args = {
    { name = 'zones' },
    { name = 'options' },
    { name = 'targetoptions' }
  },
  returns = {}
}

Target['qb-target'].AddEntityZone = {
  label = 'AddEntityZone',
  args = {
    { name = 'entity' },
    { name = 'options' },
    { name = 'targetoptions' }
  },
  returns = {}
}

Target['qb-target'].RemoveZone = {
  label = 'RemoveZone',
  args = {
    { name = 'name' }
  }
}

Target['qb-target'].AddTargetBone = {
  label = 'AddTargetBone',
  args = {
    { name = 'bones' },
    { name = 'parameters' }
  }
}

Target['qb-target'].RemoveTargetBone = {
  label = 'RemoveTargetBone',
  args = {
    { name = 'bones' },
    { name = 'labels' }
  }
}

Target['qb-target'].AddTargetEntity = {
  label = 'AddTargetEntity',
  args = {
    { name = 'entities' },
    { name = 'parameters' }
  }
}

Target['qb-target'].RemoveTargetEntity = {
  label = 'RemoveTargetEntity',
  args = {
    { name = 'entities' },
    { name = 'labels' }
  }
}

Target['qb-target'].AddTargetModel = {
  label = 'AddTargetModel',
  args = {
    { name = 'models' },
    { name = 'parameters' }
  }
}

Target['qb-target'].RemoveTargetModel = {
  label = 'RemoveTargetModel',
  args = {
    { name = 'models' },
    { name = 'labels' }
  }
}

Target['qb-target'].AddGlobalType = {
  label = 'AddGlobalType',
  args = {
    { name = 'type' },
    { name = 'parameters' }
  }
}

Target['qb-target'].AddGlobalPed = {
  label = 'AddGlobalPed',
  args = {
    { name = 'parameters' }
  }
}

Target['qb-target'].AddGlobalVehicle = {
  label = 'AddGlobalVehicle',
  args = {
    { name = 'parameters' }
  }
}

Target['qb-target'].AddGlobalObject = {
  label = 'AddGlobalObject',
  args = {
    { name = 'parameters' }
  }
}

Target['qb-target'].AddGlobalPlayer = {
  label = 'AddGlobalPlayer',
  args = {
    { name = 'parameters' }
  }
}

Target['qb-target'].RemoveGlobalType = {
  label = 'RemoveGlobalType',
  args = {
    { name = 'typ' },
    { name = 'labels' }
  }
}

Target['qb-target'].RemoveGlobalPlayer = {
  label = 'RemoveGlobalPlayer',
  args = {
    { name = 'labels' }
  }
}

Target['qb-target'].DeletePeds = {
  label = 'DeletePeds',
  args = {}
}

Target['qb-target'].SpawnPed = {
  label = 'SpawnPed',
  args = {
    { name = 'data' }
  }
}

Target['qb-target'].RemoveSpawnedPed = {
  label = 'RemoveSpawnedPed',
  args = {
    { name = 'peds' }
  }
}

Target['qb-target'].RemoveGlobalPed = {
  label = 'RemoveGlobalPed',
  args = {
    { name = 'labels' }
  }
}

Target['qb-target'].RemoveGlobalVehicle = {
  label = 'RemoveGlobalVehicle',
  args = {
    { name = 'labels' }
  }
}

Target['qb-target'].RemoveGlobalObject = {
  label = 'RemoveGlobalObject',
  args = {
    { name = 'labels' }
  }
}

Target['qb-target'].IsTargetActive = {
  label = 'IsTargetActive',
  args = {},
  returns = {}
}

Target['qb-target'].IsTargetSuccess = {
  label = 'IsTargetSuccess',
  args = {},
  returns = {}
}

Target['qb-target'].GetGlobalTypeData = {
  label = 'GetGlobalTypeData',
  args = {
    { name = 'type' },
    { name = 'label' }
  }
}

Target['qb-target'].GetZoneData = {
  label = 'GetZoneData',
  args = {
    { name = 'name' }
  },
  returns = {}
}

Target['qb-target'].GetTargetBoneData = {
  label = 'GetTargetBoneData',
  args = {
    { name = 'bone' },
    { name = 'label' }
  },
  returns = {}
}

Target['qb-target'].GetTargetEntityData = {
  label = 'GetTargetEntityData',
  args = {
    { name = 'bone' },
    { name = 'label' }
  },
  returns = {}
}

Target['qb-target'].GetTargetModelData = {
  label = 'GetTargetModelData',
  args = {
    { name = 'model' },
    { name = 'label' }
  },
  returns = {}
}

Target['qb-target'].GetGlobalPedData = {
  label = 'GetGlobalPedData',
  args = {
    { name = 'label' }
  },
  returns = {}
}

Target['qb-target'].GetGlobalVehicleData = {
  label = 'GetGlobalVehicleData',
  args = {
    { name = 'label' }
  },
  returns = {}
}

Target['qb-target'].GetGlobalObjectData = {
  label = 'GetGlobalObjectData',
  args = {
    { name = 'label' }
  },
  returns = {}
}

Target['qb-target'].GetGlobalPlayerData = {
  label = 'GetGlobalPlayerData',
  args = {
    { name = 'label' }
  },
  returns = {}
}

Target['qb-target'].UpdateGlobalTypeData = {
  label = 'UpdateGlobalTypeData',
  args = {
    { name = 'type' },
    { name = 'label' },
    { name = 'data' }
  }
}

Target['qb-target'].UpdateZoneData = {
  label = 'UpdateZoneData',
  args = {
    { name = 'name' },
    { name = 'data' }
  }
}

Target['qb-target'].UpdateTargetBoneData = {
  label = 'UpdateTargetBoneData',
  args = {
    { name = 'bone' },
    { name = 'label' },
    { name = 'data' }
  }
}

Target['qb-target'].UpdateTargetEntityData = {
  label = 'UpdateTargetEntityData',
  args = {
    { name = 'entity' },
    { name = 'label' },
    { name = 'data' }
  }
}

Target['qb-target'].UpdateTargetModelData = {
  label = 'UpdateTargetModelData',
  args = {}
}

Target['qb-target'].UpdateGlobalPedData = {
  label = 'UpdateGlobalPedData',
  args = {
    { name = 'label' },
    { name = 'data' }
  }
}

Target['qb-target'].UpdateGlobalVehicleData = {
  label = 'UpdateGlobalVehicleData',
  args = {
    { name = 'label' },
    { name = 'data' }
  }
}

Target['qb-target'].UpdateGlobalObjectData = {
  label = 'UpdateGlobalObjectData',
  args = {
    { name = 'label' },
    { name = 'data' }
  }
}

Target['qb-target'].UpdateGlobalPlayerData = {
  label = 'UpdateGlobalPlayerData',
  args = {
    { name = 'label' },
    { name = 'data' }
  }
}

Target['qb-target'].GetPeds = {
  label = 'GetPeds',
  args = {},
  returns = {}
}

Target['qb-target'].UpdatePedsData = {
  label = 'UpdatePedsData',
  args = {
    { name = 'index' },
    { name = 'data' }
  }
}

Target['qb-target'].AllowTargeting = {
  label = 'AllowTargeting',
  args = {
    { name = 'bool' }
  }
}
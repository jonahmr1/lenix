---@diagnostic disable: duplicate-set-field

---@param data OxTargetPolyZone | table
---@return number
Target.ox_target.AddPolyZone = {
  label = 'addPolyZone',
  args = {
    { name = 'data' }
  },
  returns = {}
}

---@param data OxTargetBoxZone | table
---@return number
Target.ox_target.AddBoxZone = {
  label = 'addBoxZone',
  args = {
    { name = 'data' }
  },
  returns = {}
}

---@param data OxTargetSphereZone | table
---@return number
Target.ox_target.AddSphereZone = {
  label = 'addSphereZone',
  args = {
    { name = 'data' }
  },
  returns = {}
}

---@param id number | string The ID of the zone to check. It can be either a number or a string representing the zone's index or name, respectively.
---@return boolean returns true if the zone with the specified ID exists, otherwise false.
Target.ox_target.ZoneExists = {
  label = 'zoneExists',
  args = {
    { name = 'id' }
  },
  returns = {}
}

---@param id number | string
---@param suppressWarning boolean?
Target.ox_target.RemoveZone = {
  label = 'removeZone',
  args = {
    { name = 'id' },
    { name = 'suppressWarning' }
  }
}

---@param options OxTargetOption | OxTargetOption[]
Target.ox_target.AddGlobalPed = {
  label = 'addGlobalPed',
  args = {
    { name = 'options' }
  }
}

---@param options string | string[]
Target.ox_target.RemoveGlobalPed = {
  label = 'removeGlobalPed',
  args = {
    { name = 'options' }
  }
}

---@param options OxTargetOption | OxTargetOption[]
Target.ox_target.AddGlobalVehicle = {
  label = 'addGlobalVehicle',
  args = {
    { name = 'options' }
  }
}

---@param options string | string[]
Target.ox_target.RemoveGlobalVehicle = {
  label = 'removeGlobalVehicle',
  args = {
    { name = 'options' }
  }
}

---@param options OxTargetOption | OxTargetOption[]
Target.ox_target.AddGlobalObject = {
  label = 'addGlobalObject',
  args = {
    { name = 'options' }
  }
}

---@param options string | string[]
Target.ox_target.RemoveGlobalObject = {
  label = 'removeGlobalObject',
  args = {
    { name = 'options' }
  }
}

---@param options OxTargetOption | OxTargetOption[]
Target.ox_target.AddGlobalPlayer = {
  label = 'addGlobalPlayer',
  args = {
    { name = 'options' }
  }
}

---@param options string | string[]
Target.ox_target.RemoveGlobalPlayer = {
  label = 'removeGlobalPlayer',
  args = {
    { name = 'options' }
  }
}

---@param arr (number | string) | (number | string)[]
---@param options OxTargetOption | OxTargetOption[]
Target.ox_target.AddModel = {
  label = 'addModel',
  args = {
    { name = 'arr' },
    { name = 'options' }
  }
}

---@param arr (number | string) | (number | string)[]
---@param options? string | string[]
Target.ox_target.RemoveModel = {
  label = 'removeModel',
  args = {
    { name = 'arr' },
    { name = 'options' }
  }
}

---@param arr number | number[]
---@param options OxTargetOption | OxTargetOption[]
Target.ox_target.AddEntity = {
  label = 'addEntity',
  args = {
    { name = 'arr' },
    { name = 'options' }
  }
}

---@param arr number | number[]
---@param options? string | string[]
Target.ox_target.RemoveEntity = {
  label = 'removeEntity',
  args = {
    { name = 'arr' },
    { name = 'options' }
  }
}

---@param arr number | number[]
---@param options OxTargetOption | OxTargetOption[]
Target.ox_target.AddLocalEntity = {
  label = 'addLocalEntity',
  args = {
    { name = 'arr' },
    { name = 'options' }
  }
}

---@param arr number | number[]
---@param options? table
Target.ox_target.RemoveLocalEntity = {
  label = 'removeLocalEntity',
  args = {
    { name = 'arr' },
    { name = 'options' }
  }
}

---@param options OxTargetOption | OxTargetOption[]
Target.ox_target.AddGlobalOption = {
  label = 'addGlobalOption',
  args = {
    { name = 'options' }
  }
}

---@param options string | string[]
Target.ox_target.RemoveGlobalOption = {
  label = 'removeGlobalOption',
  args = {
    { name = 'options' }
  }
}

---@param entity? number
---@param _type? number
---@param model? number
Target.ox_target.GetTargetOptions = {
  label = 'getTargetOptions',
  args = {
    { name = 'entity' },
    { name = '_type' },
    { name = 'model' }
  },
  returns = {}
}

Target.ox_target.DisableTargeting = {
  label = 'disableTargeting',
  args = {
    { name = 'value' }
  }
}

Target.ox_target.IsActive = {
  label = 'isActive',
  args = {},
  returns = {}
}
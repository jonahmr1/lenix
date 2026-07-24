# tr_adapter (Still on Development)

**Universal FiveM Resource Adapter** - Use any FiveM resource without dependency conflicts.

## Overview

`tr_adapter` acts as a compatibility layer that translates function calls between different FiveM frameworks (QB-Core, ox_lib, PS, etc.), allowing resources to work regardless of which framework is installed on your server.

## How It Works

The adapter intercepts function calls from resources, maps them to a standardized format, then translates and routes them to whatever framework you have installed.

**Example Flow:**
```
Resource → ox_inventory.GetPlayer(name)
          ↓
    tr_adapter (intercepts)
          ↓
  Standard mapping layer
          ↓
    qb-inventory.GetPlayerIdentity(source, name)
          ↓
    Return normalized data
```

## Compatibility Matrix

We track compatibility based on function behavior:

| Feature | Status | Description |
|---------|--------|-------------|
| **Labels** | ✅ | Function name mapping |
| **Parameter Values** | ✅ | Actual values passed |
| **Parameter Count** | ✅ | Different number of params (ignored when safe) |
| **Parameter Order** | ✅ | Reordering of parameters |
| **Return Values** | ✅ | Value transformation |
| **Return Order** | ✅ | Multi-return reordering |
| **Parameter Types** | ❌ | Type conversion (planned) |
| **Return Types** | ❌ | Type conversion (planned) |
| **Error Handling** | ❌ | nil vs exceptions (planned) |

## Architecture (outdated)

### 1. Standard Mapping Layer

The adapter maintains a universal mapping of common game data:

```lua
mapping = {
  name = exports.currentScript:GetPlayerName(),
  age = exports.currentScript:GetPlayerAge(),
  nationality = exports.currentScript:GetPlayerNationality(),
  items = {...},
  bank = exports.currentScript:GetPlayerBank(),
  -- ... etc
}
```

### 2. Framework Expectations

Each framework defines its expected data structure:

```lua
['qb-inventory'] = {
  ['GetCharacter'] = {
    expect = {'name', 'age', 'nationality'},
    data = {
      name = mapping.name,
      age = mapping.age,
      nationality = mapping.nationality
    }
  }
}

['ps-inventory'] = {
  ['GetPed'] = {
    expect = {
      items = {{name = 'string', amount = 'number'}},
      charinfo = {name = 'string', bank = 'number', phone = 'string'}
    },
    data = {
      items = mapping.items,
      charinfo = {
        name = mapping.name,
        bank = mapping.bank,
        phone = mapping.phone
      }
    }
  }
}
```

### 3. Parameter Order Resolution

When parameter order differs between frameworks:

**Scenario:** Resource calls `ox_inventory:GetPlayerIdentifier(name, source)`

1. Adapter identifies the calling framework (ox_inventory)
2. Looks up expected parameter order: `{name, source}`
3. Finds installed framework (qb-inventory) expects: `{source, name}`
4. **Reorders parameters** before passing to installed framework
5. Routes call: `standard.GetPlayerId(source, name)`

## Current Limitations

⚠️ **Experimental Stage** - Expect bugs and side effects

- Type conversion not yet implemented
- Error handling differences not normalized
- Some edge cases may cause unexpected behavior
- Default values used when framework lacks specific data

## Configuration

The adapter automatically detects installed frameworks. No manual configuration required for basic operation.

## Roadmap

- [ ] Parameter type conversion
- [ ] Return type conversion
- [ ] Error handling normalization
- [ ] Support for 3+ framework labels per function
- [ ] Comprehensive framework coverage
- [ ] Performance optimization (already optimized enough)

## Use Case

Perfect for server owners who want to:
- Switch frameworks without replacing all resources
- Use resources designed for different frameworks
- Maintain compatibility across framework updates
- Reduce dependency conflicts
- Better for developers creating a multi framework script

## Technical Notes

The adapter uses function interception at the export level, maintaining a registry of standard functions that dynamically route to available framework implementations. When data isn't available from the installed framework, experimental default values are used to prevent breaks.

---

**Status:** Alpha - Use at your own risk. Report issues with specific framework combinations and function calls.

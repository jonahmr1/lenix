# lenix

The All-in-one Repository

![](https://img.shields.io/crates/l/lenix)
![](https://img.shields.io/npm/d18m/lenix)
![](https://img.shields.io/jsr/v/@lenix/lenix)
![](https://img.shields.io/crates/v/lenix)
![](https://img.shields.io/crates/d/lenix)

## 📥 Install

### Deno
```sh
deno add jsr:@lenix/lenix
```

## Usage
### Modules
```ts
import lenix from '@lenix/lenix'
```

### TypeScript

```json
{
  "extends": ["@lenix/lenix/beta"]
}
```

## Examples

```ts
import { wait } from 'jsr:@lenix/lenix'

// Delay 1 second
await wait(1000)
```
```ts
import { entries } from 'jsr:@lenix/lenix'

// Typed Object.entries
const e = entries({ name: 'lenix', version: 1 })
```
```ts
import { oneOf } from 'jsr:@lenix/lenix'

// Type-safe array check
if (oneOf(status, ['active', 'idle'] as const)) { ... }

```
```ts
import { raise } from 'jsr:@lenix/lenix'

// Throw from expression context
const value = maybeNull ?? raise('value was null')
```
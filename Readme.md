# lenix

The All-in-one Package

![](https://img.shields.io/npm/d18m/lenix)
![](https://img.shields.io/npm/v/lenix)

## 📥 Install

### Deno
```bash
deno add jsr:@lenix/lenix
```

## Usage
### Modules
```ts
import { wait, caughtFetch, entries, raise, guard } from '@lenix/lenix'
```

### Lint

```ts
import lint from '@lenix/lenix/lint' with { type: "json" }
{
  ...
  languageOptions: {
    ...,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
    ...,
  },
  rules: {
    ...,
    ...lint.strict as any,
    ...,
  }
  ...
},
```

```json
	"compilerOptions": {
		...,
		"types": ["node"],
		...
	}
```

### TypeScript

```json
{
  "extends": ["@lenix/lenix/beta"]
}
```

### Formatter

```bash
deno run jsr:@lenix/lenix format
```
# lenix

The All-in-one Repository

## 🗺️ Roadmap
### Lint
- [ ] fix the lint tsconfig.json file creation when no file is found
### Extension
- [x] trim the diff's unusefull text
- [ ] use walkthrough instead of custom page
- [ ] use webview to add quick settings
- [ ] use modal dialog to confirm the walkthrough
- [x] use progressive notify
- [ ] use add commit reminder
- ~~[/] add a revert last commit button~~ (use amend instead)
- [ ] add more configuration to the commit composer extension
### OOP
- [ ] Implement the complete annotation
- [ ] Provide Documentation
- [ ] Clearify the installation steps

## Usage
### Lint
```ts
import lint from 'lenix/lint' with { type: "json" }
languageOptions: {
  [....],
  parserOptions: {
    projectService: true,
    tsconfigRootDir: import.meta.dirname,
  },
  [....],
}
rules: {
  [....],
  ...lint.strict
  [....],
}
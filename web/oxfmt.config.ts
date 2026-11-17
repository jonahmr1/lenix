import { defineConfig } from 'oxfmt'

export default defineConfig({
  endOfLine: 'lf',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  printWidth: 80,
  sortPackageJson: false,
  sortTailwindcss: {
    stylesheet: 'app/globals.css',
    functions: ['cn', 'cva'],
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '.next/',
    '.turbo/',
    'coverage/',
    'pnpm-lock.yaml',
    '.pnpm-store/',
  ],
})

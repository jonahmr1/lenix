#!/usr/bin/env node
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import eslintJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
import type { ESLint } from 'eslint'

type PluginWithRules = ESLint.Plugin & { rules: Record<string, any> }

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const c = { reset:'\x1b[0m',bold:'\x1b[1m',dim:'\x1b[2m',cyan:'\x1b[36m',yellow:'\x1b[33m',green:'\x1b[32m',red:'\x1b[31m',blue:'\x1b[34m',magenta:'\x1b[35m',gray:'\x1b[90m' }
const title   = (s: string) => `${c.bold}${c.cyan}${s}${c.reset}`
const section = (s: string) => `\n${c.bold}${c.blue}━━ ${s} ━━${c.reset}`
const bold    = (s: string) => `${c.bold}${s}${c.reset}`
const dim     = (s: string) => `${c.dim}${s}${c.reset}`
const gray    = (s: string) => `${c.gray}${s}${c.reset}`
const tag     = (s: string, col: string) => `${col}[${s}]${c.reset}`
const pr      = (s: string) => `${c.magenta}${s}${c.reset}`

const ttyFd = fs.openSync('/dev/tty', 'r')
function readLine(question: string): string {
  process.stdout.write(question)
  const buf = Buffer.alloc(1024)
  let result = ''
  while (true) {
    const n = fs.readSync(ttyFd, buf, 0, 1, null)
    if (n === 0) break
    const ch = buf.toString('utf8', 0, n)
    if (ch === '\n') break
    if (ch === '\r') continue
    result += ch
  }
  return result
}

const CHECKPOINT = '.eslint-wizard-progress.json'

type State = {
  outFile: string
  allRules: Record<string, string>
  completedSections: Set<string>
  pausedSection: string | null
  pausedAt: number
}

type CheckpointData = {
  outFile: string
  rules: Record<string, string>
  completedSections: string[]
  pausedSection: string | null
  pausedAt: number
}

function saveCheckpoint(state: State) {
  const data: CheckpointData = {
    outFile: state.outFile,
    rules: state.allRules,
    completedSections: [...state.completedSections],
    pausedSection: state.pausedSection,
    pausedAt: state.pausedAt,
  }
  fs.writeFileSync(CHECKPOINT, JSON.stringify(data, null, 2), 'utf8')
}

function loadCheckpoint(): CheckpointData | null {
  try {
    if (!fs.existsSync(CHECKPOINT)) return null
    return JSON.parse(fs.readFileSync(CHECKPOINT, 'utf8')) as CheckpointData
  } catch { return null }
}

type RuleInfo = {
  fullName: string
  description: string
  fixable: boolean
  recommended: boolean
  requiresTypeChecking: boolean
  url: string
}

function buildPluginRules(rules: Record<string, any>, prefix: string): RuleInfo[] {
  return Object.entries(rules)
    .filter(([, r]) => !r.meta?.deprecated)
    .map(([name, r]) => ({
      fullName: `${prefix}/${name}`,
      description: r.meta?.docs?.description ?? '',
      fixable: !!r.meta?.fixable,
      recommended: !!(r.meta?.docs?.recommended),
      requiresTypeChecking: !!(r.meta?.docs?.requiresTypeChecking),
      url: r.meta?.docs?.url ?? '',
    }))
}

async function getCoreRules(): Promise<Record<string, RuleInfo[]>> {
  try {
    const { builtinRules } = await import('eslint/use-at-your-own-risk')
    const byCat: Record<string, RuleInfo[]> = {}
    for (const [name, r] of (builtinRules as Map<string, any>).entries()) {
      if (r.meta?.deprecated) continue
      const cat: string = r.meta?.docs?.category ?? 'Other'
      if (!byCat[cat]) byCat[cat] = []
      byCat[cat].push({ fullName: name, description: r.meta?.docs?.description ?? '', fixable: !!r.meta?.fixable, recommended: !!(r.meta?.docs?.recommended), requiresTypeChecking: false, url: r.meta?.docs?.url ?? '' })
    }
    return byCat
  } catch {
    return { 'Core': Object.keys(eslintJs.configs.all.rules ?? {}).map(n => ({ fullName: n, description: '', fixable: false, recommended: false, requiresTypeChecking: false, url: '' })) }
  }
}

function askRule(rule: RuleInfo, idx: number, total: number): [string, string] | 'save' | null {
  const tags = [rule.recommended ? tag('recommended',c.green) : null, rule.fixable ? tag('fixable',c.yellow) : null, rule.requiresTypeChecking ? tag('type-aware',c.red) : null].filter(Boolean).join(' ')
  process.stdout.write(`\n${gray(`[${idx}/${total}]`)} ${bold(rule.fullName)} ${tags}\n`)
  if (rule.description) process.stdout.write(`  ${dim(rule.description)}\n`)
  if (rule.url) process.stdout.write(`  ${gray(rule.url)}\n`)
  const a = readLine(pr('  → off/warn/error/skip/save [o/w/e/s/q]: ')).trim().toLowerCase()
  if (!a || a === 's' || a === 'skip') return null
  if (a === 'q' || a === 'save')       return 'save'
  if (a === 'o' || a === 'off')        return [rule.fullName, 'off']
  if (a === 'w' || a === 'warn')       return [rule.fullName, 'warn']
  if (a === 'e' || a === 'error')      return [rule.fullName, 'error']
  process.stdout.write(gray('  Invalid, skipping.\n'))
  return null
}

function askSection(label: string, rules: RuleInfo[], state: State) {
  if (state.completedSections.has(label)) {
    process.stdout.write(gray(`  ✓ Already completed: ${label}\n`))
    return
  }

  process.stdout.write(section(label) + '\n')
  process.stdout.write(gray(`  ${rules.length} rules — Enter=skip  q=save & exit\n`))

  const skip = readLine(pr('  Skip entire section? [y/N]: ')).trim().toLowerCase()
  if (skip === 'y') {
    state.completedSections.add(label)
    saveCheckpoint({ ...state, pausedSection: null, pausedAt: 0 })
    process.stdout.write(gray('  Skipped.\n'))
    return
  }

  const startAt = state.pausedSection === label ? (state.pausedAt ?? 0) : 0
  if (startAt > 0) process.stdout.write(gray(`  Resuming from rule ${startAt + 1}/${rules.length}\n`))

  for (let i = startAt; i < rules.length; i++) {
    const entry = askRule(rules[i], i + 1, rules.length)

    if (entry === 'save') {
      saveCheckpoint({ ...state, pausedSection: label, pausedAt: i })
      process.stdout.write(`\n${tag('saved', c.green)} Progress saved to ${bold(CHECKPOINT)}\n`)
      process.stdout.write(dim('Run the wizard again to resume.\n\n'))
      fs.closeSync(ttyFd)
      process.exit(0)
    }

    if (entry) state.allRules[entry[0]] = entry[1]
    saveCheckpoint({ ...state, pausedSection: label, pausedAt: i + 1 })
  }

  state.completedSections.add(label)
  saveCheckpoint({ ...state, pausedSection: null, pausedAt: 0 })
}

function generateConfig(allRules: Record<string, string>): string {
  const core: Record<string, string> = {}
  const ts: Record<string, string> = {}
  const reactR: Record<string, string> = {}
  const imp: Record<string, string> = {}
  for (const [k, v] of Object.entries(allRules)) {
    if (k.startsWith('@typescript-eslint/')) ts[k] = v
    else if (k.startsWith('react/') || k.startsWith('react-hooks/')) reactR[k] = v
    else if (k.startsWith('import/')) imp[k] = v
    else core[k] = v
  }
  const hasTs    = Object.keys(ts).length > 0
  const hasReact = Object.keys(reactR).length > 0
  const hasImp   = Object.keys(imp).length > 0
  const hasCore  = Object.keys(core).length > 0
  const ind = (o: object, n: number) => JSON.stringify(o, null, 2).split('\n').map((l, i) => i === 0 ? l : ' '.repeat(n) + l).join('\n')
  return [
    `import js from '@eslint/js'`,
    `import globals from 'globals'`,
    hasTs    ? `import tseslint from 'typescript-eslint'` : '',
    hasReact ? `import pluginReact from 'eslint-plugin-react'` : '',
    hasReact ? `import reactHooks from 'eslint-plugin-react-hooks'` : '',
    hasImp   ? `import importPlugin from 'eslint-plugin-import'` : '',
    `import { defineConfig } from 'eslint/config'`,
    ``,
    `export default defineConfig([`,
    `  {`,
    `    files: ['**/*.{ts,tsx}'],`,
    `    plugins: { js },`,
    `    extends: ['js/recommended'],`,
    `    languageOptions: {`,
    `      globals: { ...globals.browser, ...globals.node },`,
    hasTs ? `      parserOptions: {\n        projectService: true,\n        tsconfigRootDir: import.meta.dirname,\n      },` : '',
    `    },`,
    `    ignores: ['dist', 'node_modules', 'src-tauri'],`,
    hasCore ? `    rules: ${ind(core, 4)},` : '',
    `  },`,
    hasTs ? `  ...tseslint.configs.strictTypeChecked,` : '',
    hasTs ? `  { rules: ${ind(ts, 4)} },` : '',
    hasReact ? `  pluginReact.configs.flat['jsx-runtime'],` : '',
    hasReact ? `  { settings: { react: { version: 'detect' } } },` : '',
    hasReact ? `  {\n    plugins: { 'react-hooks': reactHooks },\n    rules: ${ind(reactR, 4)},\n  },` : '',
    hasImp ? `  {\n    plugins: { import: importPlugin },\n    rules: ${ind(imp, 4)},\n  },` : '',
    `])`,
  ].filter(Boolean).join('\n')
}

async function main() {
  process.stdout.write('\x1Bc')
  process.stdout.write(title('╔════════════════════════════════╗\n'))
  process.stdout.write(title('║     ESLint Config Wizard       ║\n'))
  process.stdout.write(title('╚════════════════════════════════╝\n'))
  process.stdout.write(dim('\nWalks through every rule across all plugins.\n'))
  process.stdout.write(dim('o=off  w=warn  e=error  s/Enter=skip  q=save & exit\n\n'))

  const checkpoint = loadCheckpoint()
  const state: State = { allRules: {}, completedSections: new Set(), outFile: 'eslint.config.js', pausedSection: null, pausedAt: 0 }

  if (checkpoint) {
    process.stdout.write(`${tag('found', c.yellow)} Saved progress detected (${Object.keys(checkpoint.rules).length} rules configured).\n`)
    const resume = readLine(pr('Resume? [Y/n]: ')).trim().toLowerCase()
    if (resume !== 'n') {
      state.outFile = checkpoint.outFile
      state.allRules = checkpoint.rules
      state.completedSections = new Set(checkpoint.completedSections)
      state.pausedSection = checkpoint.pausedSection ?? null
      state.pausedAt = checkpoint.pausedAt ?? 0
    } else {
      state.outFile = readLine(pr('Output file [eslint.config.js]: ')).trim() || 'eslint.config.js'
    }
  } else {
    state.outFile = readLine(pr('Output file [eslint.config.js]: ')).trim() || 'eslint.config.js'
  }

  const coreByCategory = await getCoreRules()
  for (const [cat, rules] of Object.entries(coreByCategory))
    askSection(`Core — ${cat}`, rules, state)

  const tsAll = buildPluginRules(((tseslint.plugin as unknown) as PluginWithRules).rules ?? {}, '@typescript-eslint')
  askSection('TypeScript', tsAll.filter(r => !r.requiresTypeChecking), state)
  askSection('TypeScript — type-aware', tsAll.filter(r => r.requiresTypeChecking), state)
  askSection('React', buildPluginRules((react.rules ?? {}) as Record<string, any>, 'react'), state)
  askSection('React Hooks', buildPluginRules((reactHooks.rules ?? {}) as Record<string, any>, 'react-hooks'), state)
  askSection('Imports', buildPluginRules((importPlugin.rules ?? {}) as Record<string, any>, 'import'), state)

  const config = generateConfig(state.allRules)
  fs.writeFileSync(state.outFile, config, 'utf8')
  if (fs.existsSync(CHECKPOINT)) fs.unlinkSync(CHECKPOINT)

  process.stdout.write(`\n${tag('done', c.green)} Written to ${bold(state.outFile)}\n`)
  process.stdout.write(dim(`Rules configured: ${Object.keys(state.allRules).length}\n`))
  process.stdout.write(dim(`Run: pnpm add -D eslint @eslint/js globals typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-import\n\n`))

  fs.closeSync(ttyFd)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
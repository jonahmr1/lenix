#!/usr/bin/env node
import { spawnSync } from 'child_process'
const [,, cmd, ...args] = process.argv
if (cmd === '--lint') spawnSync('node', [new URL('./dist/lint.mjs', import.meta.url).pathname, ...args], { stdio: 'inherit' })
else console.log('Usage: lenix --lint')
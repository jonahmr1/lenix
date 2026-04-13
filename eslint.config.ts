import js from 'npm:@eslint/js'
import globals from 'npm:globals'
import tseslint from 'npm:typescript-eslint'
import { defineConfig } from 'npm:eslint/config'
import prettier from 'npm:eslint-config-prettier'
import lint from './modules/lint/preset.json' with { type: 'json' }

export default defineConfig([
	{
		ignores: ['lint/**', 'extension/**'],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		plugins: { js },
		extends: ['js/recommended', prettier],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		// @ts-expect-error - Somehow eslint RuleConfig type is requiring an unknown value on each key
		rules: lint.strict,
	},
	tseslint.configs.recommended,
])

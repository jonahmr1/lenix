import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import lint from 'lenix/lint' with { type: 'json' }

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

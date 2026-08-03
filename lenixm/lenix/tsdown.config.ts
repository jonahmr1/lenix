import { defineConfig, type UserConfig } from 'tsdown'
import postBuild from './scripts/postBuild.ts'
import { genDirsTypes } from './scripts/dirsTypes.ts'

genDirsTypes()

const config: Record<string, UserConfig> = {
	resource: {
		outExtensions() {
			return { js: '.js' }
		},
		outputOptions: {
			keepNames: true,
			entryFileNames: '[name].js',
			codeSplitting: false,
		},
		deps: {
			skipNodeModulesBundle: false,
			alwaysBundle: '/.*/',
			onlyBundle: false,
			neverBundle: 'public/*',
		},
	},

	client: {
		platform: 'browser',
		target: 'es2023',
		format: 'cjs',
	},

	server: {
		platform: 'node',
		format: 'cjs',
	},
}

function createConfig(name: string): UserConfig {
	return {
		name,
		entry: {
			[name]: `./resource/${name}/index.ts`,
		},
		tsconfig: `./resource/${name}/tsconfig.json`,
		...config.resource,
		...config[name],
		onSuccess: postBuild,
	}
}

export default defineConfig([createConfig('client'), createConfig('server')])

import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],
	base: './',
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'scripts': path.resolve(__dirname, '../resource/common/scripts'),
		},
	},
})

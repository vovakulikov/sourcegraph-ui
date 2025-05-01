import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

import { nodePolyfills } from 'vite-plugin-node-polyfills';

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import UnpluginAutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

export default defineConfig({
	css: {
		modules: {
			localsConvention: 'camelCase'
		}
	},
	plugins: [
		sveltekit(),
		// Add node polyfills plugin with specific settings
		nodePolyfills({
			// Whether to polyfill `node:` protocol imports
			protocolImports: true,
			// Configure specific polyfills to include
			include: ['path', 'process'],
		}),
		UnpluginAutoImport({
			dts: './src/auto-imports.d.ts',
			resolvers: [
				IconsResolver({
					prefix: 'i',
					customCollections: ['sg', 'symbol'],
				}),
			],
		}),
		Icons({
			compiler: 'svelte',
			customCollections: {
				sg: FileSystemIconLoader('./assets/icons'),
				symbol: FileSystemIconLoader('./assets/symbol-icons'),
			},
		}),
	]
});

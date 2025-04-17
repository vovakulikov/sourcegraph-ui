import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { Connect } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import UnpluginAutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { componentRegistryPlugin } from './src/lib/plugins'

export default defineConfig({
	plugins: [
		sveltekit(),
		componentRegistryPlugin(),
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
	],
	optimizeDeps: {
		exclude: ['@rollup/browser', 'rollup-plugin-scss']
	},
	server: {
		// @ts-expect-error - middleware exists but is not in the type definitions
		middleware: () => [
			(req: Connect.IncomingMessage, res: any, next: Connect.NextFunction) => {
				if (req.url?.endsWith('.wasm')) {
					res.setHeader('Content-Type', 'application/wasm');
				}
				next();
			}
		]
	}
});

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import UnpluginAutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { componentRegistryPlugin } from './src/lib/plugins'

export default defineConfig({
	plugins: [
		sveltekit(),
		componentRegistryPlugin(),
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
		exclude: ['@rollup/browser']
	},
	server: {
		middleware: () => [
			(req, res, next) => {
				if (req.url?.endsWith('.wasm')) {
					res.setHeader('Content-Type', 'application/wasm');
				}
				next();
			}
		]
	}
});

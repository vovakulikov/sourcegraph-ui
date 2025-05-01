import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: [vitePreprocess(), mdsvex({
		extensions: ['.svx'],
		layout: { _: './src/layouts/MDXLayout.svelte' }
	})],
	kit: {
		adapter: adapter(),
		alias: {
			'$layouts': './src/layouts',
			'$layouts/*': './src/layouts/*',
			'@sourcegraph/ui': './src/lib',
			'@sourcegraph/ui/*': './src/lib/*',
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;

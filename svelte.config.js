import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: [vitePreprocess(), mdsvex({
		extensions: ['.svx'],
		layout: {
			_: './src/lib/layouts/MDXLayout.svelte'
		}
	})],
	kit: { adapter: adapter() },
	extensions: ['.svelte', '.svx']
};

export default config;

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
	return {
		navigationEntries: [
			{ name: 'Dev Environment', url: '/docs/dev-env' },
			{ name: 'Data fetching', url: '/docs/data-fetching' },
			{ name: 'Testing', url: '/docs/testing' },
		]
	}
}

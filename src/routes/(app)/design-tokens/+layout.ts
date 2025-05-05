import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
	return {
		navigationEntries: [
			{ name: 'Overview', url: '/design-tokens/overview' },
			{ name: 'Reference tokens', url: '/design-tokens/reference-tokens' }
		]
	}
}

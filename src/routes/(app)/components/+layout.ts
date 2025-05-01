import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
	return {
		navigationEntries: [
			{ name: 'Icon', url: '/components/icon' },
			{ name: 'Badge', url: '/components/badge' },
			{ name: 'Button', url: '/components/button' },
			{ name: 'Alert', url: '/components/alert' },
			{ name: 'Error Alert', url: '/components/error-alert' },
			{ name: 'Textarea', url: '/components/textarea' },
			{ name: 'Checkbox', url: '/components/checkbox' },
			{ name: 'Loading Spinner', url: '/components/loading-spinner' },
			{ name: 'Select', url: '/components/select' },
		]
	}
}

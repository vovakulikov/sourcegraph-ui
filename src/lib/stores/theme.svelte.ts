export type ThemeType = 'light' | 'dark' | 'high-contrast';

// Create a simple theme store with $state 
let theme = $state<ThemeType>('light');

// Initialize from localStorage (client-side only)
if (typeof window !== 'undefined') {
	const savedTheme = localStorage.getItem('theme') as ThemeType | null;
	if (savedTheme) {
		theme = savedTheme;
		applyTheme(savedTheme);
	}
}

export function getTheme(): ThemeType {
	return theme;
}

export function setTheme(newTheme: ThemeType): void {
	theme = newTheme;
	
	// Apply theme to DOM
	applyTheme(theme);
	
	// Save to localStorage
	if (typeof window !== 'undefined') {
		localStorage.setItem('theme', theme);
	}
}

// Helper function to apply theme to DOM
function applyTheme(theme: ThemeType): void {
	if (typeof window === 'undefined') return; // Skip during SSR

	// Remove all theme classes
	document.documentElement.classList.remove('theme-dark');
	document.documentElement.classList.remove('theme-high-contrast');
	
	// Set appropriate theme
	document.documentElement.setAttribute('data-theme', theme);
	if (theme === 'dark') {
		document.documentElement.classList.add('theme-dark');
	} else if (theme === 'high-contrast') {
		document.documentElement.classList.add('theme-high-contrast');
	}
}

export const themeOptions = [
	{ value: 'light', label: 'Light Theme' },
	{ value: 'dark', label: 'Dark Theme' },
	{ value: 'high-contrast', label: 'High Contrast Theme' },
];
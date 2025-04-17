<script lang="ts">
	// Import specific to this app global styles and
	// import the main component style entrypoint
	import '$lib/init'
	import './global.scss'

	import { Icon } from '$lib'
	import { page } from '$app/stores'
	import { onMount } from 'svelte';

	import { Select } from '$lib'

	let { children } = $props()

	// Theme selection functionality
	type ThemeType = 'light' | 'dark' | 'high-contrast';
	let currentTheme: ThemeType = 'light';
	
	const setTheme = (theme: ThemeType) => {
		currentTheme = theme;
		
		// Remove all theme classes
		document.documentElement.classList.remove('theme-dark');
		document.documentElement.classList.remove('theme-high-contrast');
		
		// Set appropriate theme
		document.documentElement.setAttribute('data-theme', currentTheme);
		if (currentTheme === 'dark') {
			document.documentElement.classList.add('theme-dark');
		} else if (currentTheme === 'high-contrast') {
			document.documentElement.classList.add('theme-high-contrast');
		}
	};

	onMount(() => {
		// Check for saved theme preference
		const savedTheme = localStorage.getItem('theme') as ThemeType | null;
		if (savedTheme) {
			currentTheme = savedTheme;
			setTheme(currentTheme);
		}
	});

	// Watch for theme changes to save preference
	$effect(() => {
		localStorage.setItem('theme', currentTheme);
	})

	const themeOptions = [
		{ value: 'light', label: 'Light Theme' },
		{ value: 'dark', label: 'Dark Theme' },
		{ value: 'high-contrast', label: 'High Contrast Theme' },
	];
</script>

<main>
	<header class={{ 'header': true, 'header--transparent': $page.route.id === '/' }}>
		<a href="/">
			<Icon icon={ISgMark} --sg-comp-icon-size="1.5rem"/>
		</a>
		<nav>
			<a href="/components/icon">Components</a>
			<a href="/docs">Docs</a>
			<a href="/design-tokens">Design Tokens</a>
			<a href="/playground">Playground</a>
		</nav>
		<div class="theme-selector">
			<Select
				options={themeOptions}
				id="theme-select"
				bind:value={currentTheme}
				onchange={() => setTheme(currentTheme)}
			/>
		</div>
	</header>
	<div class={{ 'content': true, 'content--home': $page.route.id === '/' }}>
		{@render children()}
	</div>
</main>

<style lang="scss">
		main {
			display: flex;
			flex-direction: column;
			height: 100%;
      background-color: var(--sg-sys-backgound);
			position: relative;
		}

		.header {
			display: flex;
			align-items: center;
			gap: 1rem;
			padding: 0.75rem 1rem;
			color: var(--sg-ref-gray-100);
			position: relative;
			z-index: 2;
      box-shadow: var(--sg-shadow-100);
      background-color: var(--sg-ref-gray-1200);
			justify-content: space-between;

			&--transparent {
        box-shadow: none;
        background-color: color-mix(in srgb, var(--sg-ref-gray-1200) 50%, transparent);
        backdrop-filter: blur(12px);
			}
		}

		nav {
			display: flex;
			gap: 1rem;
			flex: 1;

			a {
				color: inherit;
				text-decoration: none;
				font-weight: 500;
				padding: var(--sg-space-100) var(--sg-space-200);
				border-radius: var(--sg-border-radius-100);
			}

			a:hover {
				background-color: var(--sg-ref-gray-1000);
			}
		}

		.theme-selector {
			display: flex;
			align-items: center;
			margin-left: auto;
		}

		:global(.theme-selector select) {
      --sg-comp-select-component: var(--sg-ref-gray-1000);
			cursor: pointer;
			transition: all 0.2s ease;
			font-weight: 500;
			color: var(--sg-ref-gray-100);
			outline: none;
			border:none;
		}

		.content {
			display: flex;
			flex-grow: 1;
			overflow: hidden;

			&--home {
				overflow: unset;
			}
		}
</style>

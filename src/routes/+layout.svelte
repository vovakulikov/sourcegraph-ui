<script lang="ts" module>
	const NAVIGATIONS_ITEMS = [
		{ label: "Components", url: "/components" },
		{ label: "Documentation", url: "/docs" },
		{ label: "Design Tokens", url: "/design-tokens" },
	]
</script>

<script lang="ts">
	// Import specific to this app global styles and
	// import the main component style entrypoint
	import '$lib/init'

	// Demo specific global styles
	import './global.scss'

	import { page } from '$app/state'
	import { Icon, Select, THEME_STATE, type ThemeMode } from '@sourcegraph/ui'

	let { children } = $props()

	let isHomePage = $derived(page.route.id === '/')
	let currentPath = $derived(page.url.pathname);

	let themeOptions = $derived(THEME_STATE.MODES.map(mode => ({
		value: mode,
		label: mode.toWellFormed()
	})))

	// Init root HTML element with theme and mode attributes
	THEME_STATE.initialize()

	function onThemeChange(event: Event): void {
		if (event.target instanceof HTMLSelectElement) {
			THEME_STATE.userPrefersMode.current = event.target.value as ThemeMode
		}
	}

	function isActive(url: string): boolean {
		return currentPath.startsWith(url)
	}
</script>

<main>
	<header class={{ 'header': true, 'header--transparent': isHomePage }}>
		<a href="/">
			<Icon icon={ISgMark} --sg-comp-icon-size="1.5rem"/>
		</a>
		<nav>
			{#each NAVIGATIONS_ITEMS as item}
				<a href={item.url} class:active={isActive(item.url)}>{item.label}</a>
			{/each}
		</nav>
		<div class="theme-selector">
			<Select
				id="theme-select"
				value={THEME_STATE.userPrefersMode.current}
				options={themeOptions}
				onchange={onThemeChange}
			/>
		</div>
	</header>
	<div class={{ 'content': true, 'content--home': isHomePage }}>
		{@render children()}
	</div>
</main>

<style lang="scss">
		main {
      height: 100%;
      position: relative;
			display: flex;
			flex-direction: column;
      background-color: var(--sg-sys-background);
		}

		.header {
      position: relative;
      z-index: 2;
			display: flex;
			align-items: center;
      justify-content: space-between;
			gap: 1rem;
			padding: 0.75rem 1rem;
			border-bottom: 1px solid var(--sg-sys-border-color);
      color: var(--sg-sys-card-foreground);
      background-color: var(--sg-sys-card-background);

			&--transparent {
        box-shadow: none;
        backdrop-filter: blur(12px);
				color: var(--sg-sys-primary-foreground);
				border-color: color-mix(in oklch, var(--sg-sys-border-color) 30%, transparent);
        background-color: color-mix(in oklch, var(--sg-ref-gray-700) 40%, transparent);

				:global(.theme-selector select) {
          --sg-comp-select-component: var(--sg-ref-gray-1000);
          color: var(--sg-sys-primary-foreground);
          border: none;
				}
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
				padding: var(--sg-sys-space-100) var(--sg-sys-space-200);
				border-radius: var(--sg-sys-border-radius);
			}

			a:hover, a.active {
        color: var(--sg-sys-accent-foreground);
				background-color: var(--sg-sys-accent);
			}
		}

		.theme-selector {
			display: flex;
			align-items: center;
			margin-left: auto;
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

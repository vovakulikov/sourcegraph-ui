<script lang="ts">
	// Import specific to this app global styles and
	// import the main component style entrypoint
	import '$lib/init'
	import './global.scss'

	import { Icon } from '$lib'
	import { page } from '$app/stores'

	let { children } = $props()
</script>

<main>
	<header class={{ 'header': true, 'header--transparent': $page.route.id === '/' }}>
		<a href="/">
			<Icon icon={ISgMark} --sg-comp-icon-size="1.5rem"/>
		</a>
		<nav>
			<a href="/components/icon">Components</a>
			<a href="/docs">Docs</a>
			<a href="/guides">Guidelines</a>
			<a href="/design-tokens">Design Tokens</a>
			<a href="/playground">Playground</a>
		</nav>
	</header>
	<div class="content">
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

			&--transparent {
        box-shadow: none;
        background-color: color-mix(in srgb, var(--sg-ref-gray-1200) 50%, transparent);
			}
		}

		nav {
			display: flex;
			gap: 1rem;

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

		.content {
			display: flex;
			flex-grow: 1;
			overflow: hidden;
		}
</style>

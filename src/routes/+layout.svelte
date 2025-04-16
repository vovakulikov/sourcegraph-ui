<script lang="ts">
	// Import specific to this app global styles and
	// import the main component style entrypoint
	import '$lib/init'
	import './global.scss'

	import { Icon } from '$lib'

	let { children } = $props()
</script>

<main>
	<header>
		<a href="/">
			<Icon icon={ISgMark} --sg-comp-icon-size="1.5rem"/>
		</a>
		<nav>
			<a href="/components/icon">Components</a>
			<a href="/docs">Docs</a>
			<a href="/guides">Guidelines</a>
			<a href="/design-tokens">Design Tokens</a>
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
		}

		header {
			display: flex;
			align-items: center;
			gap: 1rem;
			padding: 0.75rem 1rem;
			background-color: var(--sg-ref-gray-1200);
			color: var(--sg-ref-gray-100);
			border-bottom: 1px solid var(--sg-ref-gray-300);
			box-shadow: var(--sg-shadow-100);
		}

		nav {
			display: flex;
			gap: 1rem;

			a {
				color: inherit;
				text-decoration: none;
				font-weight: 500;
				padding: var(--sg-space-100) var(--sg-space-200);
				transition: all 0.1s ease-in-out;
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

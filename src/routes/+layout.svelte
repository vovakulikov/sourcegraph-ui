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
		<Icon icon={ISgMark} --sg-comp-icon-size="2rem"/>
		<nav>
			<a href="/components">Components</a>
			<a href="/docs">Docs</a>
			<a href="/guides">Guidelines</a>
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
			border-bottom: 2px solid var(--sg-sys-border-color);
			background-color: var(--sg-sys-backgound-dark);
		}

		nav {
			display: flex;
			gap: 1rem;
		}

		.content {
			display: flex;
			flex-grow: 1;
		}
</style>

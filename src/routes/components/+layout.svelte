<script lang="ts">
	import { page } from '$app/state';

	const COMPONENTS_PAGES = [
		{ name: 'Icon', url: '/icon' },
		{ name: 'Badge', url: '/badge' },
		{ name: 'Button', url: '/button' },
		{ name: 'Alert', url: '/alert' },
		{ name: 'Error Alert', url: '/error-alert' },
		{ name: 'Textarea', url: '/textarea' },
		{ name: 'Checkbox', url: '/checkbox' },
		{ name: 'Loading Spinner', url: '/loading-spinner' },
		{ name: 'Select', url: '/select' },
	];

	let { children } = $props();
	let currentPath = $derived(page.url.pathname);

	/** Check if the given component URL matches the current path */
	function isActive(componentUrl: string): boolean {
		return currentPath === `/components${componentUrl}` || 
			(componentUrl === '/alert' && currentPath === '/components') || // Special case for default route
			(componentUrl === '/icon' && currentPath === '/components/'); 
	}
</script>

<div class="root">
	<aside>
		<ul>
			{#each COMPONENTS_PAGES as item (item.url)}
				<li>
					<a
						href="/components{item.url}"
						class:active={isActive(item.url)}
						aria-current={isActive(item.url) ? 'page' : undefined}
					>
						{item.name}
					</a>
				</li>
			{/each}
		</ul>
</aside>

	<div class="content">
		<div class="inner-wrapper">
			{@render children()}
		</div>
	</div>
</div>

<style lang="scss">
	.root {
		width: 100%;
		height: 100%;
		display: flex;
		overflow: hidden;
	}

	aside {
		width: 300px;
		height: 100%;
		overflow: auto;
		background-color: var(--sg-sys-card-background);
		border-right: 1px solid var(--sg-sys-border-color);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	a {
		padding: 0.75rem 1.25rem;
		display: block;
		color: var(--sg-sys-foreground);
		text-decoration: none;

		&:hover {
			color: var(--sg-sys-accent-foreground);
			background-color: var(--sg-sys-accent);
		}

		&:global(.active), &[aria-current="page"] {
			color: var(--sg-sys-primary-foreground);
      background-color: var(--sg-sys-primary);
		}
	}

	.content {
		height: 100%;
		width: 100%;
		flex-grow: 1;
		padding: 2rem;
		overflow: auto;
		background-color: var(--sg-sys-background);

		// Global styles override for component demo pages
		:global(h2) {
			font-size: 1.75rem;
			margin-top: 0;
			margin-bottom: 1.5rem;
			padding-bottom: 0.5rem;
			border-bottom: 1px solid var(--sg-sys-border-color);
		}

		:global(h3) {
			font-size: 1.5rem;
			margin-top: 2rem;
			margin-bottom: 1rem;
		}

		:global(p) {
      line-height: 1.6;
			margin-bottom: 1.5rem;
		}

		.inner-wrapper {
      margin: 0 auto;
			max-width: 800px;
		}
	}
</style>

<script lang="ts">
	import { page } from '$app/stores';

	const COMPONENTS_PAGES = [
		{ name: 'Icon', url: '/icon' },
		{ name: 'Badge', url: '/badge' },
		{ name: 'Button', url: '/button' },
		{ name: 'Alert', url: '/alert' },
		{ name: 'ErrorAlert', url: '/error-alert' },
		{ name: 'Textarea', url: '/textarea' },
		{ name: 'Checkbox', url: '/checkbox' },
		{ name: 'LoadingSpinner', url: '/loadingSpinner' },
		{ name: 'Select', url: '/select' },
		{ name: 'Combobox', url: '/combobox' }
	];

	let { children } = $props();

	let currentPath = $derived($page.url.pathname);

	/**
	 * Check if the given component URL matches the current path
	 */
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
		width: 240px;
		height: 100%;
		overflow: auto;
		background-color: var(--sg-sys-background-light);
		border-right: 1px solid var(--sg-sys-border-color);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		border-bottom: 1px solid var(--sg-sys-border-subtle);
		&:last-child {
			border-bottom: none;
		}
	}

	a {
		padding: 0.75rem 1.25rem;
		display: block;
		color: var(--sg-sys-text-color);
		text-decoration: none;
		transition: background-color 0.2s ease;
		font-size: 0.95rem;
		border-left: 3px solid transparent;

		&:hover {
			background-color: var(--sg-sys-background-hover);
		}

		&:global(.active), &[aria-current="page"] {
			color: var(--sg-sys-primary-color);
			border-left-color: var(--sg-sys-primary-color);
			font-weight: 500;
			background-color: var(--sg-sys-background);
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

		:global(h4) {
			font-size: 1.25rem;
			margin-top: 1.5rem;
			margin-bottom: 0.75rem;
			color: var(--sg-sys-text-color-muted);
		}

		:global(p) {
			margin-bottom: 1.5rem;
			line-height: 1.6;
		}

		.inner-wrapper {
			max-width: 800px;
			margin: 0 auto;
		}
	}
</style>

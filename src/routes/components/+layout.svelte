<script lang="ts">
	const COMPONENTS_PAGES = [
		{ name: 'Icon', url: '/icon' },
		{ name: 'Badge', url: '/badge' },
		{ name: 'Button', url: '/button' },
		{ name: 'Alert', url: '/alert' },
		{ name: 'ErrorAlert', url: '/errorAlert' },
		{ name: 'Checkbox', url: '/checkbox' }
	];

	let { children } = $props();
</script>

<div class="root">
	<aside>
		<ul>
			{#each COMPONENTS_PAGES as item (item.url)}
				<li>
					<a href="/components{item.url}">
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
		border-right: 2px solid var(--sg-sys-border-color);
	}

	ul {
		list-style: none;
		padding: 1rem 1.5rem;
	}

	.content {
		height: 100%;
		width: 100%;
		flex-grow: 1;
		padding: 1rem;
		overflow: auto;

		// Global styles override for component demo pages
		:global(h2) {
			margin-bottom: 2rem;
		}

		:global(p) {
			margin-bottom: 1rem;
		}

		.inner-wrapper {
			max-width: 700px;
		}
	}
</style>

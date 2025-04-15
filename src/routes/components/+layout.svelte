<script lang="ts">
		const COMPONENTS_PAGES = [
			{ name: 'Icon', url: '/icon' }
		]

		let { children } = $props()
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
		{@render children()}
	</div>
</div>

<style lang="scss">
	.root {
		height: 100%;
		display: flex;
	}

	aside {
		width: 300px;
		height: 100%;
		border-right: 2px solid var(--sg-sys-border-color);
	}


  ul {
    list-style: none;
    padding: 1rem 1.5rem;
  }

  .content {
		height: 100%;
		flex-grow: 1;
		padding: 1rem;
	}
</style>

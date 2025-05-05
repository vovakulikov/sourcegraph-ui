
<script lang="ts">
	import { page } from '$app/state'
	import type { LayoutProps } from './$types'

	let { children }: LayoutProps = $props();

	let currentPath = $derived(page.url.pathname);
	let entries = $derived(page.data.navigationEntries)

	function isActive(url: string): boolean {
		return currentPath.startsWith(url)
	}
</script>

<div class="page">
	<aside class="page__sidebar">
		<ul class="page__navigation">
			{#each entries as item (item.url)}
				<li>
					<a
						href="{item.url}"
						class="page__navigation-link"
						aria-current={isActive(item.url) ? 'page' : undefined}
					>
						{item.name}
					</a>
				</li>
			{/each}
		</ul>
	</aside>

	<div class="page__content" data-page-content>
		{@render children()}
	</div>
</div>

<style lang="scss">
	.page {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;

		&__sidebar {
      width: 300px;
      height: 100%;
      overflow: auto;
      background-color: var(--sg-sys-card-background);
      border-right: 1px solid var(--sg-sys-border-color);
		}

		&__navigation {
      padding: 0;
      margin: 0;
      list-style: none;
		}

		&__navigation-link {
      display: block;
      padding: 0.5rem 1rem;
      text-decoration: none;
      color: var(--sg-sys-foreground);

      &:hover {
        color: var(--sg-sys-accent-foreground);
        background-color: var(--sg-sys-accent);
      }

      &[aria-current="page"] {
        color: var(--sg-sys-primary-foreground);
        background-color: var(--sg-sys-primary);
      }
		}

		&__content {
      height: 100%;
      width: 100%;
      flex-grow: 1;
      padding: 2rem;
      overflow: auto;
      background-color: var(--sg-sys-background);
		}
	}
</style>

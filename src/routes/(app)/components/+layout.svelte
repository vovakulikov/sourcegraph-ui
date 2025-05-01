<script lang="ts">
	import type { LayoutProps } from './$types'

	let { children }: LayoutProps = $props();
</script>

<div class="content">
	{@render children()}
</div>

<style lang="scss">
  // Global styles override for component demo pages
	.content {
		max-width: 600px;

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

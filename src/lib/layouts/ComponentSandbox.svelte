<!--
  @component
  A component sandbox that displays a component example and its usage code.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string
		description: string
		preview: Snippet
		code: Snippet
	}

	let { title, description, preview, code } = $props()
</script>

<div class="root">
	<header class="header">
		<h3>{title}</h3>
		<small class="description">{description}</small>
	</header>

	<div class="preview">
		{@render preview()}
	</div>

	<div class="code">
		{@render code()}
	</div>
</div>

<style lang="scss">
	.root {
    overflow: hidden;
		margin-bottom: 2rem;
    border-radius: var(--sg-sys-border-radius);
		border: 1px solid var(--sg-sys-border-color);
	}

	.header {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.75rem;
    border-bottom: 1px solid var(--sg-sys-border-color);
		background-color: var(--sg-sys-background-light);
	}

	.description {
		font-size: var(--sg-sys-font-size-small);
		color: var(--sg-sys-muted-text-color);
	}

	.preview {
		padding: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--sg-sys-background);
		border-bottom: 1px solid var(--sg-sys-border-color);
	}

	.code {
		overflow: auto;
    background-color: var(--sg-sys-backgound-dark);
		font-family: var(--sg-sys-font-family-code);
	}
</style>

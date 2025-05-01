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

	let { title, description, preview, code }: Props = $props()
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
		margin-bottom: 2.5rem;
    border-radius: var(--sg-sys-border-radius);
		border: 1px solid var(--sg-sys-border-color);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.header {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1rem;
    border-bottom: 1px solid var(--sg-sys-border-color);
		background-color: var(--sg-sys-card-background);
	}

	.header h3 {
		margin: 0;
		font-size: 1.125rem;
		color: var(--sg-sys-text-color);
	}

	.description {
		font-size: var(--sg-sys-font-size-small);
		color: var(--sg-sys-muted-foreground);
		line-height: 1.4;
	}

	.preview {
		padding: 2.5rem;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid var(--sg-sys-border-color);

		// Testing grid pattern background
		background-image: linear-gradient(45deg, var(--sg-sys-card-background) 25%, transparent 25%),
			linear-gradient(-45deg, var(--sg-sys-card-background) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, var(--sg-sys-card-background) 75%),
			linear-gradient(-45deg, transparent 75%, var(--sg-sys-card-background) 75%);
		background-size: 20px 20px;
		background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
	}

	.code {
		overflow: auto;
    background-color: var(--sg-sys-background-dark, #1e1e1e);
		font-family: var(--sg-sys-font-family-code), sans-serif;
	}
</style>

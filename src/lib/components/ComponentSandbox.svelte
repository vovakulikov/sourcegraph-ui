<!--
  @component
  A component sandbox that displays a component example and its usage code.
-->
<script lang="ts">
	export let title = '';
	export let description = '';
</script>

<div class="component-sandbox">
	{#if title}
		<h3>{title}</h3>
	{/if}
	
	{#if description}
		<p class="description">{description}</p>
	{/if}

	<div class="preview">
		<slot name="preview" />
	</div>

	<div class="code">
		<slot name="code" />
	</div>
</div>

<style lang="scss">
	.component-sandbox {
		margin-bottom: 2rem;
		border: 1px solid var(--sg-sys-border-color, #e0e0e0);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	h3 {
		margin: 0;
		padding: 1rem;
		font-size: 1.2rem;
		border-bottom: 1px solid var(--sg-sys-border-color, #e0e0e0);
	}

	.description {
		padding: 0 1rem;
		margin-bottom: 1rem;
		font-size: 0.9rem;
		color: var(--sg-sys-muted-text-color, #666);
	}

	.preview {
		padding: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--sg-sys-background-subtle, #f5f5f5);
		border-bottom: 1px solid var(--sg-sys-border-color, #e0e0e0);
	}

	.code {
		background-color: var(--sg-sys-code-bg, #f8f8f8);
		padding: 1rem;
		overflow: auto;
		font-family: monospace;
		font-size: 0.9rem;
	}
</style>
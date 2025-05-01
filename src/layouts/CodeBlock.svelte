<!--
  @component
  A component for displaying code examples with syntax highlighting.
  Includes a link to open the code in the playground.
-->
<script lang="ts">
	interface CodeBlockProps {
		code: string
		language?: string
	}

	let { code, language = 'svelte' }: CodeBlockProps = $props()
</script>

<div class="code-block-container">
	<header class="code-block-header">
		<span class="language-label">{language}</span>
	</header>
	<pre class="code-block" data-language={language}><code>{code}</code></pre>
</div>

<style lang="scss">
	.code-block-container {
		position: relative;
		overflow: hidden;
		border: none;
	}

	.code-block-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.4rem 1rem;
		background-color: #2d2d2d;
		border-bottom: 1px solid var(--sg-sys-border-dark, #444444);
		color: var(--sg-sys-text-color-inverted, #f9fafb);
	}

	.language-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--sg-sys-text-muted-inverted, #a0aec0);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.code-block {
		white-space: pre;
		padding: 0.75rem 1rem;
		line-height: 1.4;
		tab-size: 2;
		background-color: #1e1e1e;
		color: var(--sg-sys-text-color-inverted, #f9fafb);
		font-family: var(--sg-sys-font-family-code), monospace;
		font-size: 0.9rem;
		margin: 0;
		overflow-x: auto;
	}

	code {
		display: block;
	}
</style>

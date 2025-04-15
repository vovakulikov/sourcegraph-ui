<!--
  @component
  A component for displaying code examples with syntax highlighting.
-->
<script lang="ts">
	export let code = '';
	export let language = 'html';
</script>

<pre class="code-block" data-language={language}><code>{code}</code></pre>

<style lang="scss">
	.code-block {
		margin: 0;
		padding: 0.5rem;
		background-color: var(--sg-sys-code-bg, #f8f8f8);
		border-radius: 0.25rem;
		overflow-x: auto;
		font-family: monospace;
		font-size: 0.9rem;
		line-height: 1.5;
		white-space: pre;
		tab-size: 2;
	}

	code {
		display: block;
	}
</style>
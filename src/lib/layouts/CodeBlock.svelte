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
    white-space: pre;
		padding: 0.75rem;
		line-height: 1.5;
		tab-size: 2;
    background-color: var(--sg-sys-background-light);
    font-family: var(--sg-sys-font-family-code);
	}

	code {
		display: block;
	}
</style>

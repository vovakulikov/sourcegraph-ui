<script lang="ts">
	let { children } = $props()
</script>

<div class="design-tokens-layout">
	{@render children()}
</div>

<style lang="scss">
	.design-tokens-layout {
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
</style>
<script lang="ts">
	let { children } = $props()
</script>

<div class="content" data-page-content>
	{@render children()}
</div>

<style lang="scss">
	.content {
		max-width: 800px;
	}
</style>

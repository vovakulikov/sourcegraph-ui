<script lang="ts">
	// Import the main component style entrypoint
	import '$lib/init'
	import { SourcegraphLogo, Icon } from '$lib'

	let { children } = $props()
</script>

<main>
	<header>
		<SourcegraphLogo variant="light"/> Hello
		<Icon icon={ISgMark}/>
	</header>
	<div>
		{@render children()}
	</div>
</main>

<style lang="scss">

</style>

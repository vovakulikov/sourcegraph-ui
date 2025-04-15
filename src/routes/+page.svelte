<script lang="ts">
	import { SourcegraphLogo } from '$lib'
</script>

<div>
	<SourcegraphLogo width="500" height="72"/>
	<h1>Welcome to the tech docs and components library hub</h1>

	<footer>
		<a href="/components">Components</a>
		<a href="/docs">Docs</a>
	</footer>
</div>

<style lang="scss">
	div {
		flex-grow: 1;

		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	footer {
		margin-top: 2rem;
		display: flex;
		gap: 1rem;
	}
</style>

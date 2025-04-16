<script lang="ts">
	import { SourcegraphLogo } from '$lib'
	import SimplexNoise from '$lib/layouts/simplex-noise-wave.svelte';
</script>


<div class='content'>
	<div class='background'>
		<SimplexNoise/>
	</div>

	<SourcegraphLogo width="500" height="72" variant="dark" />
	<h2>Welcome to the tech docs and  components <br/> library hub</h2>

	<footer>
		<a href="/components/icon">Components</a>
		<a href="/docs">Docs</a>
	</footer>
</div>

<style lang="scss">
	.background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}

	.content {
		position: relative;
		z-index: 1;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	h2 {
		text-align: center;
		color: var(--sg-sys-accent-text-color);
	}

	footer {
		margin-top: 2rem;
		display: flex;
		gap: 1rem;

		a {
			color: var(--sg-sys-accent-text-color);
		}
	}
</style>

<script lang="ts">
	import { SourcegraphLogo } from '@sourcegraph/ui'
	import { SimplexNoise } from '$layouts';
</script>

<div class='content'>
	<div class='background'>
		<SimplexNoise/>
	</div>

	<SourcegraphLogo width="500" height="72" variant="dark" />
	<h1>Welcome to the tech docs and  components <br/> library hub</h1>

	<footer>
		<a href="/components/icon">Components</a>
		<a href="/docs">Docs</a>
	</footer>
</div>

<style lang="scss">
	.background {
    z-index: -1;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.content {
		z-index: 1;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	h1 {
		text-align: center;
		color: var(--sg-sys-primary-foreground);
    font-size: var(--sg-sys-font-size-1200);
		font-family: var(--sg-ref-font-family-serif), sans-serif;
	}

	footer {
		margin-top: 2rem;
		display: flex;
		gap: 1rem;

		a {
			// Links are on the animation background (we treat it as primary variation)
			// So text of these should has primary-foreground
			color: var(--sg-sys-primary-foreground);
		}
	}
</style>

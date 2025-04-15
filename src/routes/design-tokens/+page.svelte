<script lang="ts">
	// Group tokens by category
	const referenceTokenGroups = [
		{
			title: 'Typography Tokens',
			tokens: [
				'--sg-ref-font-family-sans',
				'--sg-ref-font-family-serif',
				'--sg-ref-font-family-monospace',
			]
		},
		{
			title: 'Red Color Tokens',
			tokens: [
				'--sg-ref-red-50',
				'--sg-ref-red-100',
				'--sg-ref-red-200',
				'--sg-ref-red-300',
				'--sg-ref-red-400',
				'--sg-ref-red-500',
				'--sg-ref-red-600',
				'--sg-ref-red-700',
				'--sg-ref-red-800',
				'--sg-ref-red-900',
				'--sg-ref-red-950',
			]
		},
		{
			title: 'Blue Color Tokens',
			tokens: [
				'--sg-ref-blue-50',
				'--sg-ref-blue-100',
				'--sg-ref-blue-200',
				'--sg-ref-blue-300',
				'--sg-ref-blue-400',
				'--sg-ref-blue-500',
				'--sg-ref-blue-600',
				'--sg-ref-blue-700',
				'--sg-ref-blue-800',
				'--sg-ref-blue-900',
				'--sg-ref-blue-950',
			]
		},
		{
			title: 'Orange Color Tokens',
			tokens: [
				'--sg-ref-orange-50',
				'--sg-ref-orange-100',
				'--sg-ref-orange-200',
				'--sg-ref-orange-300',
				'--sg-ref-orange-400',
				'--sg-ref-orange-500',
				'--sg-ref-orange-600',
				'--sg-ref-orange-700',
				'--sg-ref-orange-800',
				'--sg-ref-orange-900',
				'--sg-ref-orange-950',
			]
		},
		{
			title: 'Gray Color Tokens',
			tokens: [
				'--sg-ref-gray-50',
				'--sg-ref-gray-100',
				'--sg-ref-gray-200',
				'--sg-ref-gray-300',
				'--sg-ref-gray-400',
				'--sg-ref-gray-500',
				'--sg-ref-gray-600',
				'--sg-ref-gray-700',
				'--sg-ref-gray-800',
				'--sg-ref-gray-900',
				'--sg-ref-gray-950',
			]
		},
	];

	const systemTokenGroups = [
		{
			title: 'Accent Colors',
			tokens: [
				'--sg-sys-accent-text-color',
				'--sg-sys-accent-color',
				'--sg-sys-accent-color-light',
				'--sg-sys-accent-color-dark',
			]
		},
		{
			title: 'Typography',
			tokens: [
				'--sg-sys-text-color',
				'--sg-sys-font-size',
				'--sg-sys-font-size-small',
				'--sg-sys-font-size-large',
				'--sg-sys-muted-text-color',
				'--sg-sys-font-family',
				'--sg-sys-font-family-code',
			]
		},
		{
			title: 'Backgrounds',
			tokens: [
				'--sg-sys-backgound',
				'--sg-sys-backgound-dark',
			]
		},
		{
			title: 'Shadows',
			tokens: [
				'--sg-sys-shadow-color',
				'--sg-sys-shadow-color-light',
				'--sg-sys-shadow-sm',
				'--sg-sys-shadow',
				'--sg-sys-shadow-md',
				'--sg-sys-shadow-lg',
				'--sg-sys-shadow-xl',
			]
		},
		{
			title: 'Borders',
			tokens: [
				'--sg-sys-border-color',
				'--sg-sys-border-radius',
			]
		},
		{
			title: 'Focus',
			tokens: [
				'--sg-sys-focus-shadow',
				'--sg-sys-focus-shadow-inset',
			]
		},
	];
</script>

<div class="token-documentation">
	<h1>Design Tokens</h1>
	<p>
		This page displays all available CSS tokens in the Sourcegraph UI design system. Each token is shown with its name and a visual example of how it appears when applied.
	</p>

	<section>
		<h2>Reference Tokens</h2>
		<p>Reference tokens are the foundational values that don't change between themes.</p>

		{#each referenceTokenGroups as group}
			<div class="token-group">
				<h3>{group.title}</h3>
				<div class="token-list">
					{#each group.tokens as token}
						<div class="token-card">
							<div class="token-name">{token}</div>
							
							{#if token.includes('color') || token.includes('red') || token.includes('blue') || token.includes('orange') || token.includes('gray')}
								<!-- Color swatch for color tokens -->
								<div class="token-example color-swatch" style="background-color: var({token});"></div>
							{:else if token.includes('font-family')}
								<!-- Font family example -->
								<div class="token-example">
									<span style="font-family: var({token});">The quick brown fox jumps over the lazy dog</span>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</section>

	<section>
		<h2>System Tokens</h2>
		<p>System tokens define the theme itself and change between light and dark modes.</p>

		{#each systemTokenGroups as group}
			<div class="token-group">
				<h3>{group.title}</h3>
				<div class="token-list">
					{#each group.tokens as token}
						<div class="token-card">
							<div class="token-name">{token}</div>
							
							{#if token.includes('color') || token.includes('backgound')}
								<!-- Color swatch for color tokens -->
								<div class="token-example color-swatch" style="background-color: var({token});"></div>
							{:else if token.includes('font-family')}
								<!-- Font family example -->
								<div class="token-example">
									<span style="font-family: var({token});">The quick brown fox jumps over the lazy dog</span>
								</div>
							{:else if token.includes('font-size')}
								<!-- Font size example -->
								<div class="token-example">
									<span style="font-size: var({token});">Text sample</span>
								</div>
							{:else if token.includes('border-radius')}
								<!-- Border radius example -->
								<div class="token-example">
									<div class="radius-box" style="border-radius: var({token});"></div>
								</div>
							{:else if token.includes('border-color')}
								<!-- Border color example -->
								<div class="token-example">
									<div class="border-box" style="border-color: var({token});"></div>
								</div>
							{:else if token.includes('shadow')}
								<!-- Shadow example -->
								<div class="token-example">
									<div class="shadow-box" style="box-shadow: var({token});"></div>
								</div>
							{:else if token.includes('focus')}
								<!-- Focus example -->
								<div class="token-example">
									<button class="focus-demo" style="box-shadow: var({token});">Focus</button>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</section>
</div>

<style lang="scss">
	.token-documentation {
		padding: 2rem;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	h2 {
		font-size: 1.5rem;
		margin: 2rem 0 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--sg-sys-border-color);
	}

	h3 {
		font-size: 1.25rem;
		margin: 1.5rem 0 1rem;
	}

	.token-group {
		margin-bottom: 2rem;
	}

	.token-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.token-card {
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		padding: 1rem;
		background-color: white;
		box-shadow: var(--sg-sys-shadow-sm);
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.token-name {
		font-family: var(--sg-sys-font-family-code);
		font-size: 0.875rem;
		word-break: break-all;
		width: 50%;
		flex-shrink: 0;
		padding-right: 1rem;
	}

	.token-example {
		min-height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-grow: 0;
		width: 50%;
	}

	.color-swatch {
		width: 6rem;
		height: 2.5rem;
		border-radius: var(--sg-sys-border-radius);
		border: 1px solid var(--sg-sys-border-color);
	}

	.radius-box {
		width: 6rem;
		height: 2.5rem;
		background-color: var(--sg-sys-accent-color);
	}

	.border-box {
		width: 6rem;
		height: 2.5rem;
		border: 2px solid;
		border-radius: var(--sg-sys-border-radius);
	}

	.shadow-box {
		width: 6rem;
		height: 2.5rem;
		background-color: white;
		border-radius: var(--sg-sys-border-radius);
	}

	.focus-demo {
		padding: 0.5rem 1rem;
		background-color: white;
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		cursor: pointer;
	}
</style>
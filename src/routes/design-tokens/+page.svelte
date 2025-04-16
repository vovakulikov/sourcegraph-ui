<script lang="ts">
	import { onMount } from 'svelte';

	// Token categories
	const REFERENCE_PREFIX = '--sg-ref-';
	const SYSTEM_PREFIX = '--sg-sys-';
	const TOKEN_PREFIX = '--sg-';

	type TokenGroup = {
		title: string;
		tokens: string[];
		special?: string;
		type?: 'color' | 'typography' | 'spacing' | 'shadow' | 'border' | 'focus';
	};

	// Navigation categories
	type Category = {
		id: string;
		name: string;
		description: string;
	};

	const categories: Category[] = [
		{ 
			id: 'all', 
			name: 'All Tokens', 
			description: 'Complete design token collection for Sourcegraph UI' 
		},
		{ 
			id: 'colors', 
			name: 'Colors', 
			description: 'Color tokens for UI elements, backgrounds, texts and accents' 
		},
		{ 
			id: 'typography', 
			name: 'Typography', 
			description: 'Font families, sizes, weights and other typography settings' 
		},
		{ 
			id: 'spacing', 
			name: 'Spacing & Layout', 
			description: 'Spacing, sizing and layout-related tokens' 
		},
		{ 
			id: 'other', 
			name: 'Other', 
			description: 'Shadows, borders, focus states and more' 
		}
	];

	let activeCategory: string = 'all';
	let searchQuery: string = '';
	let showNotification = false;
	let notificationMessage = '';

	// Get actual CSS value for a token
	const getComputedTokenValue = (token: string): string => {
		return getComputedStyle(document.documentElement).getPropertyValue(token.substring(2));
	};

	// Format color tokens to display in grid
	const formatColorName = (token: string) => {
		const parts = token
			.replace(REFERENCE_PREFIX, '')
			.replace(SYSTEM_PREFIX, '')
			.replace(TOKEN_PREFIX, '')
			.split('-');
		const color = parts[0];
		const number = parts[1] || '';
		return number ? `${color.charAt(0).toUpperCase() + color.slice(1)}-${number}` : color;
	};

	// Generate color range from base tokens
	const generateColorRange = (color: string): string[] => {
		return Array.from({ length: 12 }, (_, i) => `${REFERENCE_PREFIX}${color}-${(i + 1) * 100}`);
	};

	// Format color values for display
	const formatColorValue = (cssValue: string): { hex: string; rgb: string; hsl: string } => {
		// Default values in case parsing fails
		let result = { hex: '#??????', rgb: 'rgb(?, ?, ?)', hsl: 'hsl(?, ?%, ?%)' };
		
		try {
			// Create a temporary element to compute the color
			const tempEl = document.createElement('div');
			tempEl.style.color = cssValue.trim();
			document.body.appendChild(tempEl);
			
			// Get computed style
			const computedColor = getComputedStyle(tempEl).color;
			document.body.removeChild(tempEl);
			
			// Parse RGB from computed style
			const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
			if (rgbMatch) {
				const [, r, g, b] = rgbMatch.map(Number);
				
				// Convert RGB to Hex
				const toHex = (c: number) => {
					const hex = c.toString(16);
					return hex.length === 1 ? '0' + hex : hex;
				};
				
				const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
				
				// Convert RGB to HSL
				const r1 = r / 255;
				const g1 = g / 255;
				const b1 = b / 255;
				
				const max = Math.max(r1, g1, b1);
				const min = Math.min(r1, g1, b1);
				let h = 0, s = 0, l = (max + min) / 2;
				
				if (max !== min) {
					const d = max - min;
					s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
					
					switch (max) {
						case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break;
						case g1: h = (b1 - r1) / d + 2; break;
						case b1: h = (r1 - g1) / d + 4; break;
					}
					
					h = Math.round(h * 60);
				}
				
				s = Math.round(s * 100);
				l = Math.round(l * 100);
				
				result = {
					hex,
					rgb: `rgb(${r}, ${g}, ${b})`,
					hsl: `hsl(${h}, ${s}%, ${l}%)`
				};
			}
		} catch (e) {
			console.error('Error parsing color value:', e);
		}
		
		return result;
	};

	// Color palettes
	const colorPalettes = [
		{ name: 'Red', color: 'red' },
		{ name: 'Blue', color: 'blue' },
		{ name: 'Green', color: 'green' },
		{ name: 'Orange', color: 'orange' },
		{ name: 'Pink', color: 'pink' },
		{ name: 'Teal', color: 'teal' },
		{ name: 'Vermilion', color: 'vermilion' },
		{ name: 'Violet', color: 'violet' },
		{ name: 'Gray', color: 'gray' }
	];

	// Typography tokens
	const typographyTokens = [
		'--sg-ref-font-family-sans',
		'--sg-ref-font-family-serif',
		'--sg-ref-font-family-monospace',
		'--sg-ref-font-family-brand',
		'--sg-ref-font-family-brand-mono'
	];

	// Generate reference token groups
	const referenceTokenGroups: TokenGroup[] = [
		{
			title: 'Typography Tokens',
			tokens: typographyTokens,
			type: 'typography'
		},
		{
			title: 'Brand Font Showcase',
			special: 'brand-fonts',
			tokens: []
		},
		...colorPalettes.map(palette => ({
			title: `${palette.name} Color Tokens`,
			tokens: generateColorRange(palette.color),
			type: 'color' as const
		}))
	];

	// System token groups
	const systemTokenGroups: TokenGroup[] = [
		{
			title: 'Accent Colors',
			tokens: [
				'--sg-sys-accent-text-color',
				'--sg-sys-accent-color',
				'--sg-sys-accent-color-light',
				'--sg-sys-accent-color-dark',
			],
			type: 'color'
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
			],
			type: 'typography'
		},
		{
			title: 'Font Sizes',
			tokens: Array.from({ length: 10 }, (_, i) => `--sg-font-size-${(i + 1) * 100}`),
			type: 'typography'
		},
		{
			title: 'Spacing',
			tokens: Array.from({ length: 10 }, (_, i) => `--sg-space-${(i + 1) * 100}`),
			type: 'spacing'
		},
		{
			title: 'Backgrounds',
			tokens: [
				'--sg-sys-background',
				'--sg-sys-background-dark',
			],
			type: 'color'
		},
		{
			title: 'Shadows',
			tokens: [
				'--sg-sys-shadow-color',
				'--sg-sys-shadow-color-light',
				...Array.from({ length: 5 }, (_, i) => `--sg-shadow-${(i + 1) * 100}`)
			],
			type: 'shadow'
		},
		{
			title: 'Borders',
			tokens: [
				'--sg-sys-border-color',
				'--sg-sys-border-radius',
			],
			type: 'border'
		},
		{
			title: 'Focus',
			tokens: [
				'--sg-sys-focus-shadow',
				'--sg-sys-focus-shadow-inset',
			],
			type: 'focus'
		},
	];

	// Get color value information (for display)
	let tokenValues: Record<string, string> = {};
	let colorValues: Record<string, { hex: string; rgb: string; hsl: string }> = {};

	onMount(() => {
		updateTokenValues();
		document.documentElement.setAttribute('data-theme', currentTheme);
	});

	const updateTokenValues = () => {
		// Populate actual CSS values for all tokens
		const allTokens = [
			...referenceTokenGroups.flatMap(group => group.tokens),
			...systemTokenGroups.flatMap(group => group.tokens)
		];
		
		allTokens.forEach(token => {
			const value = getComputedTokenValue(token);
			tokenValues[token] = value;
			
			// Parse color values for color tokens
			if (token.includes('color') || token.includes('-red-') || token.includes('-blue-') || 
				token.includes('-green-') || token.includes('-orange-') || token.includes('-pink-') || 
				token.includes('-teal-') || token.includes('-vermilion-') || token.includes('-violet-') || 
				token.includes('-gray-')) {
				colorValues[token] = formatColorValue(value);
			}
		});
		
		// Trigger reactivity
		tokenValues = { ...tokenValues };
		colorValues = { ...colorValues };
	};

	// Toggle between different theme modes for testing
	let currentTheme = 'light';
	const toggleTheme = () => {
		currentTheme = currentTheme === 'light' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', currentTheme);
		
		// Update values after theme change
		setTimeout(updateTokenValues, 100);
	};

	// Copy token value to clipboard
	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
			.then(() => {
				notificationMessage = `Copied: ${text}`;
				showNotification = true;
				setTimeout(() => {
					showNotification = false;
				}, 2000);
			})
			.catch(err => {
				console.error('Failed to copy: ', err);
			});
	};

	// Filter groups based on active category and search
	$: filteredReferenceGroups = referenceTokenGroups.filter(group => {
		// Filter by category
		if (activeCategory !== 'all') {
			if (activeCategory === 'colors' && group.type !== 'color') return false;
			if (activeCategory === 'typography' && group.type !== 'typography') return false;
			if (activeCategory === 'spacing' && group.type !== 'spacing') return false;
			if (activeCategory === 'other' && 
				!['shadow', 'border', 'focus'].includes(group.type || '')) return false;
		}
		
		// Filter by search
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			return group.title.toLowerCase().includes(query) || 
				group.tokens.some(token => token.toLowerCase().includes(query));
		}
		
		return true;
	});

	$: filteredSystemGroups = systemTokenGroups.filter(group => {
		// Filter by category
		if (activeCategory !== 'all') {
			if (activeCategory === 'colors' && group.type !== 'color') return false;
			if (activeCategory === 'typography' && group.type !== 'typography') return false;
			if (activeCategory === 'spacing' && group.type !== 'spacing') return false;
			if (activeCategory === 'other' && 
				!['shadow', 'border', 'focus'].includes(group.type || '')) return false;
		}
		
		// Filter by search
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			return group.title.toLowerCase().includes(query) || 
				group.tokens.some(token => token.toLowerCase().includes(query));
		}
		
		return true;
	});
</script>

<div class="token-documentation">
	<!-- Theme toggle and header controls -->
	<div class="page-controls">
		<h1>Design Tokens</h1>
		<button class="theme-toggle" on:click={toggleTheme}>
			{currentTheme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
		</button>
	</div>
	<p>
		This page displays all available CSS tokens in the Sourcegraph UI design system. Each token is shown with its name and a visual example of how it appears when applied.
	</p>

	<!-- Notification component -->
	{#if showNotification}
		<div class="notification">
			{notificationMessage}
		</div>
	{/if}

	<!-- Navigation -->
	<nav class="token-navigation">
		{#each categories as category}
			<button class={`token-category ${activeCategory === category.id ? 'active' : ''}`} on:click={() => activeCategory = category.id}>
				{category.name}
			</button>
		{/each}
	</nav>

	<!-- Search -->
	<div class="token-search">
		<input type="search" placeholder="Search tokens" bind:value={searchQuery} />
	</div>

	<!-- Reference Tokens -->
	<section>
		<h2>Reference Tokens</h2>
		<p>Reference tokens are the foundational values that don't change between themes.</p>

		{#each filteredReferenceGroups as group}
			<div class="token-group">
				<h3>{group.title}</h3>
				{#if group.special === 'brand-fonts'}
					<div class="font-showcase">
						<div class="font-section">
							<h4>PolySans Variable (Brand)</h4>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-brand); font-size: 32px;">The quick brown fox jumps over the lazy dog</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-brand); font-size: 24px;">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-brand); font-size: 24px;">abcdefghijklmnopqrstuvwxyz</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-brand); font-size: 24px;">0123456789</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-brand); font-style: italic; font-size: 24px;">This text is in italic style</p>
							<div class="weight-examples">
								<p class="font-example" style="font-family: var(--sg-ref-font-family-brand); font-weight: 100; font-size: 20px;">Weight 100 (Thin)</p>
								<p class="font-example" style="font-family: var(--sg-ref-font-family-brand); font-weight: 300; font-size: 20px;">Weight 300 (Light)</p>
								<p class="font-example" style="font-family: var(--sg-ref-font-family-brand); font-weight: 400; font-size: 20px;">Weight 400 (Regular)</p>
								<p class="font-example" style="font-family: var(--sg-ref-font-family-brand); font-weight: 600; font-size: 20px;">Weight 600 (Semi-Bold)</p>
								<p class="font-example" style="font-family: var(--sg-ref-font-family-brand); font-weight: 700; font-size: 20px;">Weight 700 (Bold)</p>
								<p class="font-example" style="font-family: var(--sg-ref-font-family-brand); font-weight: 900; font-size: 20px;">Weight 900 (Black)</p>
							</div>
						</div>

						<div class="font-section">
							<h4>PerfectlyNineties (Serif)</h4>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-serif); font-size: 32px;">The quick brown fox jumps over the lazy dog</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-serif); font-size: 24px;">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-serif); font-size: 24px;">abcdefghijklmnopqrstuvwxyz</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-serif); font-size: 24px;">0123456789</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-serif); font-style: italic; font-size: 24px;">This text is in italic style</p>
						</div>
						
						<div class="font-section">
							<h4>PolySans NeutralMono</h4>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-brand-mono); font-size: 32px;">The quick brown fox jumps over the lazy dog</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-brand-mono); font-size: 24px;">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-brand-mono); font-size: 24px;">abcdefghijklmnopqrstuvwxyz</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-brand-mono); font-size: 24px;">0123456789</p>
						</div>
						
						<div class="font-section">
							<h4>PolySans SlimMono (Default Monospace)</h4>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-monospace); font-size: 32px;">The quick brown fox jumps over the lazy dog</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-monospace); font-size: 24px;">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-monospace); font-size: 24px;">abcdefghijklmnopqrstuvwxyz</p>
							<p class="font-example" style="font-family: var(--sg-ref-font-family-monospace); font-size: 24px;">0123456789</p>
						</div>
					</div>
				{:else if group.title.includes('Color Tokens')}
					<div class="color-grid">
						{#each group.tokens as token}
							<div 
								class="token-card clickable" 
								on:click={() => copyToClipboard(token)} 
								on:keydown={e => e.key === 'Enter' && copyToClipboard(token)}
								role="button"
								tabindex="0"
								aria-label={`Copy ${token} to clipboard`}
							>
								<div class="token-name">{formatColorName(token)}</div>
								
								<!-- Color swatch for color tokens -->
								<div class="token-example">
									<div class="color-swatch" style="background-color: var({token});">
										#{token.split('-').pop()}
									</div>
									<div class="color-info">
										{colorValues[token]?.hex || ''}<br>
										{colorValues[token]?.rgb || ''}<br>
										{colorValues[token]?.hsl || ''}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="token-list">
						{#each group.tokens as token}
							<div 
								class="token-card token-card-horizontal clickable" 
								on:click={() => copyToClipboard(token)} 
								on:keydown={e => e.key === 'Enter' && copyToClipboard(token)}
								role="button"
								tabindex="0"
								aria-label={`Copy ${token} to clipboard`}
							>
								<div class="token-name">{token}</div>
								
								{#if token.includes('font-family')}
									<!-- Font family example -->
									<div class="token-example">
										<span style="font-family: var({token});">The quick brown fox jumps over the lazy dog</span>
									</div>
								{/if}
								<div class="token-value">
									{tokenValues[token] || ''}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</section>

	<!-- System Tokens -->
	<section>
		<h2>System Tokens</h2>
		<p>System tokens define the theme itself and change between light and dark modes.</p>

		{#each filteredSystemGroups as group}
			<div class="token-group">
				<h3>{group.title}</h3>
				{#if group.title === 'Accent Colors'}
					<div class="color-grid">
						{#each group.tokens as token}
							<div 
								class="token-card clickable" 
								on:click={() => copyToClipboard(token)} 
								on:keydown={e => e.key === 'Enter' && copyToClipboard(token)}
								role="button"
								tabindex="0"
								aria-label={`Copy ${token} to clipboard`}
							>
								<div class="token-name">{formatColorName(token)}</div>
								
								<!-- Color swatch for color tokens -->
								<div class="token-example">
									<div class="color-swatch" style="background-color: var({token});">
										#{token.split('-').pop()}
									</div>
									<div class="color-info">
										{colorValues[token]?.hex || ''}<br>
										{colorValues[token]?.rgb || ''}<br>
										{colorValues[token]?.hsl || ''}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{:else if group.title === 'Backgrounds'}
					<div class="color-grid">
						{#each group.tokens as token}
							<div 
								class="token-card clickable" 
								on:click={() => copyToClipboard(token)} 
								on:keydown={e => e.key === 'Enter' && copyToClipboard(token)}
								role="button"
								tabindex="0"
								aria-label={`Copy ${token} to clipboard`}
							>
								<div class="token-name">{formatColorName(token)}</div>
								
								<!-- Color swatch for color tokens -->
								<div class="token-example">
									<div class="color-swatch" style="background-color: var({token});">
										#{token.split('-').pop()}
									</div>
									<div class="color-info">
										{colorValues[token]?.hex || ''}<br>
										{colorValues[token]?.rgb || ''}<br>
										{colorValues[token]?.hsl || ''}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="token-list">
						{#each group.tokens as token}
							<div 
								class="token-card token-card-horizontal clickable" 
								on:click={() => copyToClipboard(token)} 
								on:keydown={e => e.key === 'Enter' && copyToClipboard(token)}
								role="button"
								tabindex="0"
								aria-label={`Copy ${token} to clipboard`}
							>
								<div class="token-name">{token}</div>
								
								{#if token.includes('font-family')}
									<!-- Font family example -->
									<div class="token-example">
										<span style="font-family: var({token});">The quick brown fox jumps over the lazy dog</span>
									</div>
								{:else if token.includes('font-size') || token.includes('font-size-')}
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
								{:else if token.includes('space')}
									<!-- Space example -->
									<div class="token-example">
										<div class="space-box" style="width: var({token}); height: var({token});"></div>
									</div>
								{:else if token.includes('shadow') || token.includes('shadow-')}
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
								<div class="token-value">
									{tokenValues[token] || ''}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</section>
	<div class="color-transform-box" style="--base-color:green">
		text
	</div>
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

	h4 {
		font-size: 1.1rem;
		margin: 1rem 0 0.5rem;
	}

	.font-showcase {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.font-section {
		padding: 1.5rem;
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		background-color: white;
		box-shadow: var(--sg-shadow-100);
	}

	.font-example {
		margin: 0.5rem 0;
		line-height: 1.5;
	}

	.weight-examples {
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--sg-sys-border-color);
	}

	.token-group {
		margin-bottom: 2rem;
	}

	.token-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.color-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.token-card {
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		padding: 1rem;
		background-color: var(--sg-sys-background-light);
		box-shadow: var(--sg-shadow-100);
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		overflow: hidden;
		max-width: 100%;
		cursor: pointer;
	}

	.token-card-horizontal {
		flex-direction: row;
		align-items: center;
	}

	.token-card-horizontal .token-name {
		width: 50%;
		text-align: left;
		margin-bottom: 0;
		padding-right: 1rem;
	}

	.token-name {
		font-family: var(--sg-sys-font-family-sans);
		font-size: 0.875rem;
		word-break: break-all;
		width: 100%;
		flex-shrink: 0;
		margin-bottom: 0.5rem;
		text-align: center;
		font-weight: 400;
	}

	.token-example {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
		width: 100%;
	}

	.color-swatch {
		width: 100%;
		height: 100px;
		border-radius: var(--sg-sys-border-radius);
		margin-bottom: 0.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		font-weight: bold;
		text-shadow: 0 0 3px rgba(0,0,0,0.5);
	}
	
	.color-info {
		font-size: 0.75rem;
		text-align: center;
		line-height: 1.5;
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

	.space-box {
		background-color: var(--sg-sys-accent-color);
		border-radius: var(--sg-sys-border-radius);
	}

	.focus-demo {
		padding: 0.5rem 1rem;
		background-color: white;
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		cursor: pointer;
	}

	.token-navigation {
		margin-bottom: 1rem;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.token-category {
		background-color: var(--sg-sys-background-light);
		padding: 0.5rem 1rem;
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		cursor: pointer;
	}

	.token-category.active {
		background-color: var(--sg-sys-accent-color);
		color: white;
	}

	.token-search {
		margin-bottom: 1rem;
	}

	.token-search input[type="search"] {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
	}

	.page-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.theme-toggle {
		background-color: var(--sg-sys-background-light);
		padding: 0.5rem 1rem;
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		cursor: pointer;
	}

	.notification {
		background-color: var(--sg-sys-background-light);
		padding: 0.5rem 1rem;
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		margin-bottom: 1rem;
	}

	.token-value {
		font-size: 0.75rem;
		margin-top: 0.5rem;
	}
</style>
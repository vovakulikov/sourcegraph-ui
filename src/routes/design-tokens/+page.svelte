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
		setTheme(currentTheme);
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

	// Theme selection functionality
	type ThemeType = 'light' | 'dark' | 'high-contrast';
	let currentTheme: ThemeType = 'light';
	const setTheme = (theme: ThemeType) => {
		currentTheme = theme;
		
		// Remove all theme classes
		document.documentElement.classList.remove('theme-dark');
		document.documentElement.classList.remove('theme-high-contrast');
		
		// Set appropriate theme
		document.documentElement.setAttribute('data-theme', currentTheme);
		if (currentTheme === 'dark') {
			document.documentElement.classList.add('theme-dark');
		} else if (currentTheme === 'high-contrast') {
			document.documentElement.classList.add('theme-high-contrast');
		}
		
		// Update values after theme change
		setTimeout(updateTokenValues, 100);
	};
	
// Theme selection will be handled by the dropdown

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
	<!-- Theme selection and header controls -->
	<div class="page-controls">
		<h1>Design Tokens</h1>
		<div class="theme-selector">
			<label for="theme-select">Theme:</label>
			<select id="theme-select" bind:value={currentTheme} on:change={() => setTheme(currentTheme)}>
				<option value="light">Light Theme</option>
				<option value="dark">Dark Theme</option>
				<option value="high-contrast">High Contrast Theme</option>
			</select>
		</div>
	</div>
	<p class="intro-text">
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
		<p class="section-description">Reference tokens are the foundational values that don't change between themes.</p>

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
		<p class="section-description">System tokens define the theme itself and change between light and dark modes.</p>

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
	:global(body), :global(html) {
		background-color: var(--sg-sys-background);
		margin: 0;
		padding: 0;
		min-height: 100vh;
		width: 100%;
		overflow-x: hidden;
	}

	:global(main) {
		background-color: var(--sg-sys-background);
	}

	:global(body > nav), :global(#app > nav) {
		background-color: #121212;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	:global(.theme-dark) :global(body > nav), :global(.theme-dark) :global(#app > nav) {
		background-color: #121212;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	:global(body:not(.theme-dark)) :global(body > nav), :global(body:not(.theme-dark)) :global(#app > nav) {
		background-color: #121212;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	:global(nav a) {
		color: var(--sg-sys-text-color);
		text-decoration: none;
	}

	:global(nav a:hover) {
		color: var(--sg-sys-accent-color-light);
	}

	.token-documentation {
		padding: var(--sg-space-600);
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		line-height: 1.6;
		color: var(--sg-sys-text-color);
		background-color: var(--sg-sys-background);
	}

	h1 {
		font-size: var(--sg-font-size-1000);
		margin-bottom: var(--sg-space-500);
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	h2 {
		font-size: var(--sg-font-size-800);
		margin: var(--sg-space-600) 0 var(--sg-space-500);
		padding-bottom: var(--sg-space-300);
		border-bottom: 1px solid var(--sg-sys-border-color);
		letter-spacing: -0.01em;
		font-weight: 500;
	}

	h3 {
		font-size: var(--sg-font-size-700);
		margin: var(--sg-space-600) 0 var(--sg-space-400);
		font-weight: 500;
	}

	h4 {
		font-size: var(--sg-font-size-600);
		margin: var(--sg-space-500) 0 var(--sg-space-300);
		font-weight: 500;
	}

	.font-showcase {
		display: flex;
		flex-direction: column;
		gap: var(--sg-space-500);
		margin-top: var(--sg-space-400);
	}

	.font-section {
		padding: var(--sg-space-500);
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		background-color: var(--sg-sys-background);
		box-shadow: var(--sg-shadow-100);
		:global(.theme-dark) & {
			background-color: var(--sg-sys-background);
			border-color: var(--sg-ref-gray-700);
		}
	}

	.font-example {
		margin: var(--sg-space-300) 0;
		line-height: 1.5;
	}

	.weight-examples {
		margin-top: var(--sg-space-500);
		padding-top: var(--sg-space-400);
		border-top: 1px solid var(--sg-sys-border-color);
	}

	.token-group {
		margin-bottom: var(--sg-space-600);
		padding-bottom: var(--sg-space-400);
		border-bottom: 1px dashed var(--sg-sys-border-color);
	}

	.token-group:last-child {
		border-bottom: none;
	}

	.token-list {
		display: flex;
		flex-direction: column;
		gap: var(--sg-space-400);
		margin-top: var(--sg-space-400);
	}

	.color-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: var(--sg-space-400);
		margin-top: var(--sg-space-400);
	}

	.token-card {
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		padding: var(--sg-space-500);
		background-color: var(--sg-sys-background-light);
		color: var(--sg-sys-text-color);
		box-shadow: var(--sg-shadow-100);
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		overflow: hidden;
		max-width: 100%;
		cursor: pointer;
		transition: all 0.2s ease;
		/* Dark theme .theme-dark specific styling */
		:global(.theme-dark) & {
			background-color: var(--sg-sys-background);
			border-color: var(--sg-ref-gray-700);
		}
	}

	.token-card:hover {
		box-shadow: var(--sg-shadow-200);
		transform: translateY(-2px);
		border-color: var(--sg-sys-accent-color-light);
		:global(.theme-dark) & {
			background-color: var(--sg-sys-background-light);
			border-color: var(--sg-sys-accent-color);
		}
	}

	.token-card-horizontal {
		flex-direction: row;
		align-items: center;
	}

	.token-card-horizontal .token-name {
		width: 50%;
		text-align: left;
		margin-bottom: 0;
		padding-right: var(--sg-space-500);
	}

	.token-name {
		font-family: var(--sg-sys-font-family-sans);
		font-size: var(--sg-font-size-400);
		word-break: break-all;
		width: 100%;
		flex-shrink: 0;
		margin-bottom: var(--sg-space-400);
		text-align: center;
		font-weight: 500;
		letter-spacing: 0.01em;
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
		margin-bottom: var(--sg-space-300);
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		font-weight: bold;
		text-shadow: 0 0 3px rgba(0,0,0,0.5);
	}
	
	.color-info {
		font-size: var(--sg-font-size-300);
		text-align: center;
		line-height: 1.6;
		font-family: var(--sg-sys-font-family-monospace);
	}

	.radius-box {
		width: var(--sg-space-800);
		height: var(--sg-space-600);
		background-color: var(--sg-sys-accent-color);
	}

	.border-box {
		width: var(--sg-space-800);
		height: var(--sg-space-600);
		border: 2px solid;
		border-radius: var(--sg-sys-border-radius);
	}

	.shadow-box {
		width: var(--sg-space-800);
		height: var(--sg-space-600);
		background-color: var(--sg-sys-background-light);
		border-radius: var(--sg-sys-border-radius);
	}

	.space-box {
		background-color: var(--sg-sys-accent-color);
		border-radius: var(--sg-sys-border-radius);
	}

	.focus-demo {
		padding: var(--sg-space-200) var(--sg-space-400);
		background-color: var(--sg-sys-background);
		color: var(--sg-sys-text-color);
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		cursor: pointer;
	}

	.token-navigation {
		margin: var(--sg-space-400) 0 var(--sg-space-500);
		display: flex;
		gap: var(--sg-space-400);
		flex-wrap: wrap;
		background-color: transparent;
		padding: var(--sg-space-300);
		border-radius: var(--sg-border-radius-200);
	}

	.token-category {
		background-color: var(--sg-sys-background-light);
		padding: var(--sg-space-300) var(--sg-space-500);
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease;
		font-weight: 500;
		
		:global(.theme-dark) & {
			background-color: var(--sg-ref-gray-800);
			border-color: var(--sg-ref-gray-700);
			color: var(--sg-ref-gray-100);
		}
	}

	.token-category:hover {
		background-color: var(--sg-sys-accent-color-light);
		color: white;
		
		:global(.theme-dark) & {
			background-color: var(--sg-sys-accent-color);
			border-color: var(--sg-sys-accent-color);
		}
	}

	.token-category.active {
		background-color: var(--sg-sys-accent-color);
		color: white;
		
		:global(.theme-dark) & {
			border-color: var(--sg-sys-accent-color-light);
			box-shadow: 0 0 0 1px var(--sg-sys-accent-color-light);
		}
	}

	.token-search {
		margin-bottom: var(--sg-space-500);
	}

	.token-search input[type="search"] {
		width: 100%;
		padding: var(--sg-space-400);
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		font-size: var(--sg-font-size-400);
		background-color: var(--sg-sys-background-light);
		color: var(--sg-sys-text-color);
	}

	.token-search input[type="search"]:focus {
		outline: none;
		border-color: var(--sg-sys-accent-color);
		box-shadow: var(--sg-sys-focus-shadow);
	}

	.page-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: var(--sg-space-400) 0 var(--sg-space-500);
	}

	.theme-selector {
		display: flex;
		align-items: center;
		gap: var(--sg-space-200);
	}

	.theme-selector label {
		font-weight: 500;
		color: var(--sg-sys-text-color);
	}

	.theme-selector select {
		background-color: var(--sg-sys-background-light);
		padding: var(--sg-space-200) var(--sg-space-400);
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		cursor: pointer;
		transition: all 0.2s ease;
		font-weight: 500;
		color: var(--sg-sys-text-color);
		outline: none;
	}

	.theme-selector select:hover {
		border-color: var(--sg-sys-accent-color);
	}

	.theme-selector select:focus {
		border-color: var(--sg-sys-accent-color);
		box-shadow: var(--sg-sys-focus-shadow);
	}

	.notification {
		background-color: var(--sg-sys-background-light);
		padding: var(--sg-space-300) var(--sg-space-500);
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-sys-border-radius);
		margin-bottom: var(--sg-space-400);
		font-weight: 500;
	}

	.token-value {
		font-size: var(--sg-font-size-300);
		margin-top: var(--sg-space-400);
		font-family: var(--sg-sys-font-family-monospace);
	}

	.intro-text {
		font-size: var(--sg-font-size-500);
		max-width: 40em;
		line-height: 1.6;
		margin-bottom: var(--sg-space-400);
	}
	
	.section-description {
		font-size: var(--sg-font-size-500);
		max-width: 40em;
		line-height: 1.6;
		margin-bottom: var(--sg-space-400);
		color: var(--sg-sys-muted-text-color);
	}
</style>
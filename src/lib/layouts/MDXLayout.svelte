<script lang="ts">
	// Default layout for MDX files
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	// Import Prism for syntax highlighting
	import './prism-syntax.css';

	let { children }: { children: Snippet } = $props();
	let contentEl: HTMLElement;
	let tocItems = $state<{ id: string; level: number; text: string }[]>([]);
	let activeHeadingId = $state<string>('');
	
	$effect(() => {
		document.title = 'Sourcegraph Documentation';
	});
	
	// Generate table of contents after content has been rendered
	$effect(() => {
		if (!contentEl) return;

		// Reset TOC items
		const newTocItems: { id: string; level: number; text: string }[] = [];

		// Find all headings in the content
		const headings = contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
		
		// Process each heading
		headings.forEach((heading) => {
			const level = parseInt(heading.tagName.charAt(1));
			const text = heading.textContent || '';
			
			// Generate an ID if not already present
			if (!heading.id) {
				heading.id = text
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/^-|-$/g, '');
			}

			newTocItems.push({ id: heading.id, level, text });
		});
		
		// Update tocItems with the new array
		tocItems = newTocItems;
	});

	// Setup Intersection Observer for headings
	$effect(() => {
		if (!contentEl || tocItems.length === 0) return;
		
		// Set the first heading as active if there's no active heading yet
		if (!activeHeadingId && tocItems.length > 0) {
			activeHeadingId = tocItems[0].id;
		}

		// Create observers for all headings
		const headingElements = tocItems.map(item => document.getElementById(item.id));
		
		// Options for the intersection observer
		const options = {
			root: null, // viewport
			rootMargin: '-80px 0px -40%', // Adjusted to improve detection with close headings
			threshold: [0, 0.25, 0.5] // Multiple thresholds for better accuracy
		};

		const observer = new IntersectionObserver((entries) => {
			// Track entries with their intersection ratios
			const visibleHeadingsWithRatio = entries
				.filter(entry => entry.isIntersecting)
				.map(entry => ({ id: entry.target.id, ratio: entry.intersectionRatio }));

			// If we have visible headings, update the active one
			if (visibleHeadingsWithRatio.length > 0) {
				// Find visible headings in TOC order with their intersection ratios
				const orderedVisibleHeadings = tocItems
					.filter(item => visibleHeadingsWithRatio.some(vh => vh.id === item.id))
					.map(item => {
						const matchingHeading = visibleHeadingsWithRatio.find(vh => vh.id === item.id);
						return { id: item.id, ratio: matchingHeading ? matchingHeading.ratio : 0 };
					});

				if (orderedVisibleHeadings.length > 0) {
					// Select the heading with the highest intersection ratio, or the first one if tied
					const bestHeading = orderedVisibleHeadings.reduce((prev, current) => 
						current.ratio > prev.ratio ? current : prev, orderedVisibleHeadings[0]);
					activeHeadingId = bestHeading.id;
				}
			}
		}, options);

		// Observe all heading elements
		headingElements.forEach(el => {
			if (el) observer.observe(el);
		});

		// Cleanup function
		return () => {
			headingElements.forEach(el => {
				if (el) observer.unobserve(el);
			});
			observer.disconnect();
		};
	});

	// Function to determine classes for TOC items
	function getTocItemClass(item: { id: string; level: number; text: string }): string {
		const levelClass = `toc-level-${item.level}`;
		const activeClass = item.id === activeHeadingId ? 'active' : '';
		return `${levelClass} ${activeClass}`.trim();
	}
</script>

<article class="mdx-article">
	{#if tocItems.length > 0}
		<aside class="toc">
			<div class="toc-header">Table of Contents</div>
			<nav>
				<ul>
					{#each tocItems as item}
						<li class={getTocItemClass(item)}>
							<a href={`#${item.id}`} class={item.id === activeHeadingId ? 'active' : ''}>
								{item.text}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</aside>
	{/if}

	<div class="content" bind:this={contentEl}>
		{@render children()}
	</div>
</article>

<style>
	.mdx-article {
		max-width: 1200px;
		padding: 2rem;
		font-family: var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
		color: var(--text-primary, #1d1d1d);
		background-color: var(--bg-primary, #ffffff);
		line-height: 1.6;
		display: grid;
		grid-template-columns: minmax(200px, 1fr) minmax(0, 3fr);
		gap: 2rem;
		align-items: start;
	}

	/* Table of Contents */
	.toc {
		position: sticky;
		top: 2rem;
		height: max-content;
		padding: 1rem;
		border-radius: 6px;
		background-color: var(--toc-bg, #f8f9fa);
		border: 1px solid var(--toc-border, #e1e4e8);
		font-size: 0.9rem;
		margin-top: 1rem; /* Align with first heading */
	}

	.toc-header {
		font-weight: 600;
		margin-bottom: 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--toc-border, #e1e4e8);
	}

	.toc nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.toc nav li {
		margin: 0.25rem 0;
	}

	.toc nav a {
		color: var(--toc-link, #0366d6);
		text-decoration: none;
		display: block;
		padding: 0.2rem 0.5rem;
		border-radius: 3px;
		transition: all 0.2s ease;
		border-left: 2px solid transparent;
	}

	.toc nav a:hover {
		background-color: var(--toc-hover-bg, #f1f1f1);
	}

	.toc nav a.active {
		background-color: var(--toc-active-bg, #e6f1ff);
		color: var(--toc-active-color, #0366d6);
		font-weight: 500;
		border-left: 2px solid var(--toc-active-border, #0366d6);
	}

	/* TOC indent levels */
	.toc-level-1 { font-weight: 600; }
	.toc-level-2 { padding-left: 0.75rem; }
	.toc-level-3 { padding-left: 1.5rem; }
	.toc-level-4 { padding-left: 2.25rem; }
	.toc-level-5, .toc-level-6 { padding-left: 3rem; }

	/* Content area */
	.content {
		width: 100%;
		padding-top: 0; /* Remove default padding */
		text-align: left;
	}

	.content :global(h1),
	.content :global(h2),
	.content :global(h3),
	.content :global(h4),
	.content :global(h5),
	.content :global(h6) {
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-weight: 600;
		line-height: 1.25;
	}

	/* First heading should align with TOC */
	.content :global(h1:first-child),
	.content :global(h2:first-child),
	.content :global(h3:first-child),
	.content :global(h4:first-child),
	.content :global(h5:first-child),
	.content :global(h6:first-child) {
		margin-top: 1rem;
	}

	.content :global(h1) {
		font-size: 2.5rem;
		border-bottom: 1px solid var(--border-color, #eaecef);
		padding-bottom: 0.5rem;
	}

	.content :global(h2) {
		font-size: 2rem;
		border-bottom: 1px solid var(--border-color, #eaecef);
		padding-bottom: 0.5rem;
	}

	.content :global(h3) {
		font-size: 1.5rem;
	}

	.content :global(p) {
		margin-bottom: 1.5rem;
	}

	/* Code blocks */
	.content :global(pre) {
		background-color: var(--code-bg, #f0f2f5);
		border: 1px solid var(--code-border, #e1e4e8);
		border-radius: 6px;
		padding: 1rem;
		overflow-x: auto;
		margin: 1.5rem 0;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	/* Both code blocks and inline code */
	.content :global(pre),
	.content :global(code) {
		font-family: var(--font-mono, 'Roboto Mono', monospace);
		font-size: 0.9rem;
	}

	/* Inline code */
	.content :global(code) {
		background-color: var(--inline-code-bg, rgba(27, 31, 35, 0.05));
		border-radius: 3px;
		padding: 0.2em 0.4em;
		color: var(--inline-code-color, #24292e);
		border: 1px solid var(--inline-code-border, #e1e4e8);
	}

	/* Fix nested code inside pre */
	.content :global(pre code) {
		background-color: transparent;
		border: none;
		padding: 0;
		font-size: inherit;
		color: inherit;
	}

	.content :global(a) {
		color: var(--link-color, #0366d6);
		text-decoration: none;
	}

	.content :global(a:hover) {
		text-decoration: underline;
	}

	.content :global(ul),
	.content :global(ol) {
		margin-bottom: 1.5rem;
		padding-left: 2rem;
	}

	.content :global(li) {
		margin-bottom: 0.5rem;
	}

	.content :global(blockquote) {
		border-left: 4px solid var(--blockquote-border, #dfe2e5);
		color: var(--blockquote-text, #6a737d);
		padding-left: 1rem;
		margin: 1.5rem 0;
	}

	.content :global(table) {
		border-collapse: collapse;
		width: 100%;
		margin: 1.5rem 0;
	}

	.content :global(th),
	.content :global(td) {
		border: 1px solid var(--table-border, #dfe2e5);
		padding: 0.6rem 1rem;
		text-align: left;
	}

	.content :global(th) {
		background-color: var(--table-header-bg, #f6f8fa);
	}

	.content :global(img) {
		max-width: 100%;
		border-radius: 4px;
	}

	@media (max-width: 1024px) {
		.mdx-article {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.toc {
			position: relative;
			top: 0;
			order: -1;
			margin-bottom: 1.5rem;
		}
	}

	@media (max-width: 768px) {
		.mdx-article {
			padding: 1rem;
		}
	}
</style>

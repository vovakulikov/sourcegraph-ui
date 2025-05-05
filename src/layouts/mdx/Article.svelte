<script lang="ts">
	import type { Snippet } from 'svelte'

	import './prism-highlighting.scss'
	import styles from './Article.module.scss'

	interface Props {
		title: string;
		children: Snippet;
		maxWidth: string
	}

	let { title, maxWidth = '800px', children }: Props = $props()

	let activeHeadingId = $state<string>('');
	let contentElement: HTMLElement | null = $state(null)
	let tocItems = $state<{ id: string; level: number; text: string }[]>([]);

	$effect.pre(() => {
		if (!contentElement) return;

		// Reset TOC items
		const newTocItems: { id: string; level: number; text: string }[] = [];

		// Find all headings in the content
		const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');

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
	})

</script>

<div class="layout" style:max-width={maxWidth}>
	<h1 class="layout__title">{title}</h1>

	{#if tocItems.length > 0}
		<div class="layout__navigation navigation">
			<span class="navigation__title">On this page</span>
			<nav>
				<ul class="navigation__list">
					{#each tocItems as item}
						<li>
							<a href={`#${item.id}`} class={item.id === activeHeadingId ? 'active' : ''}>
								{item.text}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	{/if}

	<div
		bind:this={contentElement}
		class="layout__content {styles.content}"
	>
		{@render children()}
	</div>
</div>

<style lang="scss">
	:global([data-page-content]) {
    container-type: inline-size;
	}

	.layout {
		display: grid;
		width: 100%;
		grid-template-rows: auto;
		grid-template-columns: 1fr;
    grid-template-areas:
							'title'
							'navigation'
							'content';

    @container (width > 650px) {
      column-gap: 1.5rem;
      grid-template-columns: 1fr auto;
      grid-template-areas:
      				'title .'
      				'content navigation';

      &__navigation {
        max-width: 300px;
        height: min-content;
      	position: sticky;
      	top: 0;
      }
    }

		&__title {
			grid-area: title;
			margin-bottom: 2rem;
		}

		&__navigation {
			grid-area: navigation;
			margin-bottom: 1.5rem;
		}

		&__content {
			grid-area: content;
      overflow: hidden;
		}
	}

	.navigation {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
		padding: 0.75rem 1rem;
    color: var(--sg-sys-card-foreground);
		background-color: var(--sg-sys-card-background);
		border-radius: var(--sg-sys-border-radius);
		border: 1px solid var(--sg-sys-border-color);

		&__title {
			font-weight: bold;
		}

		&__list {
      list-style: none;
      padding: 0;
      margin: 0;
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
		}
	}
</style>

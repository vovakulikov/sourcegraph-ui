<!--
   @component

   The root element of this component can be target via the [data-badge] selector.
-->

<script lang="ts" module>
	export const BADGE_VARIANTS = [
		'primary',
		'secondary',
		'success',
		'danger',
		'warning',
		'info',
		'merged',
		'outlineSecondary',
		'link'
	] as const;

	export type BadgeVariantType = (typeof BADGE_VARIANTS)[number];
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: BadgeVariantType;
		/** Allows modifying the size of the badge. Supports a smaller variant. */
		small?: boolean;
		/** Render the badge as a rounded pill. */
		pill?: boolean;
		/** Custom inline styles for the badge */
		style?: string;
		/** Additional custom class names to apply */
		class?: string;
		children?: Snippet;
		custom?: Snippet<[{ className: string }]>;
	}

	let { variant, small, pill, style, class: customClass, children, custom }: Props = $props();
	
	// Convert outlineSecondary to outline-secondary for CSS class compatibility
	let variantClass = $derived(variant === 'outlineSecondary' ? 'outline-secondary' : variant);
	
	// Build classes list and filter out falsy values
	let cls = $derived([
		'badge',
		variantClass, 
		small ? 'small' : '',
		pill ? 'pill' : '',
		customClass || ''
	].filter(Boolean).join(' '));
</script>

{#if custom}
	{@render custom({ className: cls })}
{:else}
	<span class={cls} data-badge {style}>
		{@render children?.()}
	</span>
{/if}

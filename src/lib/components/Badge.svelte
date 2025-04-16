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

<style lang="scss">
  /* Sourcegraph's color system for badges - direct hex values */
  .badge {
    display: inline-block;
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 4px;
    line-height: 1rem;
  }
  
  .primary {
    background-color: #0b70db !important;
    color: white !important;
  }
  
  .secondary {
    background-color: #e6ebf2 !important;
    color: #343a4d !important;
  }
  
  .success {
    background-color: #2ea043 !important;
    color: white !important;
  }
  
  .danger {
    background-color: #dc3545 !important;
    color: white !important;
  }
  
  .warning {
    background-color: #ffc107 !important;
    color: black !important;
  }
  
  .info {
    background-color: #72dbe8 !important;
    color: black !important;
  }
  
  .merged {
    background-color: #a305e1 !important;
    color: white !important;
  }
  
  .outline-secondary {
    background-color: transparent !important;
    color: #5e6e8c !important;
    border: 1px solid #e6ebf2 !important;
  }
  
  .link {
    background-color: #f9fafb !important;
    color: #0b70db !important;
    font-family: monospace !important;
    font-weight: normal !important;
  }
  
  .small {
    font-size: 0.75rem !important;
    padding: 0 0.25rem !important;
    border-radius: 2px !important;
  }
  
  .pill {
    padding-right: 0.6em !important;
    padding-left: 0.6em !important;
    border-radius: 10rem !important;
  }
</style>

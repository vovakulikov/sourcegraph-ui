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
		children?: Snippet;
		custom?: Snippet<[{ className: string }]>;
	}

	let { variant, small, pill, children, custom }: Props = $props();
	
	// Build classes list and filter out falsy values
	let cls = $derived([
		'badge',
		variant,
		small ? 'small' : '',
		pill ? 'pill' : '',
	].filter(Boolean).join(' '));
</script>

{#if custom}
	{@render custom({ className: cls })}
{:else}
	<span class={cls} data-badge>
		{@render children?.()}
	</span>
{/if}

<style lang="scss">

	:root {
		--sg-comp-badge-padding-x: 0.375rem;
		--sg-comp-badge-padding-y: 0.125rem;
		--sg-comp-badge-font-size: 0.75rem;
    --sg-comp-badge-border-radius: 0.25rem;
		--sg-comp-badge-color: var(--sg-sys-secondary-foreground);
		--sg-comp-badge-background: var(--sg-sys-secondary);
	}

  .badge {
    display: inline-block;
    padding: var(--sg-comp-badge-padding-y) var(--sg-comp-badge-padding-x);
    font-size: var(--sg-comp-badge-font-size);
    border-radius: var(--sg-comp-badge-border-radius);
		color: var(--sg-comp-badge-color);
		background-color: var(--sg-comp-badge-background);
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    line-height: 1rem;
  }
  
  .primary {
    --sg-comp-badge-color: var(--sg-sys-primary-foreground);
    --sg-comp-badge-background: var(--sg-sys-primary);
  }
  
  .secondary {
    --sg-comp-badge-color: var(--sg-sys-secondary-foreground);
    --sg-comp-badge-background: var(--sg-sys-secondary);
  }
  
  .success {
    --sg-comp-badge-color: var(--sg-sys-accent-foreground);
    --sg-comp-badge-background: var(--sg-ref-green-500);
  }
  
  .danger {
    --sg-comp-badge-color: var(--sg-sys-accent-foreground);
    --sg-comp-badge-background: var(--sg-sys-destructive);
  }
  
  .warning {
    --sg-comp-badge-color: var(--sg-sys-accent-foreground);
    --sg-comp-badge-background: var(--sg-ref-orange-500);
  }
  
  .info {
    --sg-comp-badge-color: var(--sg-sys-accent-foreground);
    --sg-comp-badge-background: var(--sg-ref-teal-500);
  }
  
  .merged {
    --sg-comp-badge-color: var(--sg-sys-accent-foreground);
    --sg-comp-badge-background: var(--sg-ref-violet-600);
  }
  
  .small {
    --sg-comp-badge-font-size: 0.75rem;
		--sg-comp-badge-padding-x: 0.25rem;
		--sg-comp-badge-padding-y: 0;
    --sg-comp-badge-border-radius: 2px;
  }
  
  .pill {
    --sg-comp-badge-padding-y: 0;
    --sg-comp-badge-padding-x: 0.6em;
    --sg-comp-badge-border-radius: 1rem;
  }
</style>

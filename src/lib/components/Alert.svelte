<script lang="ts" module>
	import type { IconComponent } from './icon/Icon.svelte'

	export type AlertVariant = 'info' | 'warning' | 'danger' | 'success';

	const ICONS_VARIANTS: Record<AlertVariant, IconComponent> = {
		'info': ILucideCircleAlert,
		'warning': ILucideTriangleAlert,
		'danger': ILucideCircleAlert,
		'success': ILucideCircleCheckBig,
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte'
	import Icon from './icon/Icon.svelte'

	interface Props {
		small?: boolean;
		variant?: AlertVariant
		title?: Snippet
		children: Snippet
	}

	let { small, variant, title, children }: Props = $props()
</script>

<div role="alert" class="alert {variant} {small ? 'slim' : ''}">
	<div class="alert__icon">
		<Icon icon={ICONS_VARIANTS[variant ?? 'info']} />
	</div>
	<div class="alert__content">
		{@render (title ?? children)()}

		{#if title}
			<div>{@render children()}</div>
		{/if}
	</div>
</div>

<style lang="scss">
	:root {
		--sg-comp-alert-icon-size: 1.2rem;
		--sg-comp-alert-color: var(--sg-sys-secondary);
		--sg-comp-alert-icon-color: var(--sg-sys-primary-foreground);
		--sg-comp-alert-background: var(--sg-sys-background);
		--sg-comp-alert-padding-x: var(--sg-sys-space-300);
		--sg-comp-alert-padding-y: var(--sg-sys-space-300);
	}

	.alert {
    display: flex;
    align-items: flex-start;
    gap: calc(var(--sg-comp-alert-padding-x) * 1.5);
    padding: var(--sg-comp-alert-padding-y) var(--sg-comp-alert-padding-x);
    position: relative;
		overflow: hidden;
		border: 1px solid var(--sg-comp-alert-color);
		border-radius: var(--sg-sys-border-radius);
		background-color: var(--sg-comp-alert-background);

		&__icon {
      --sg-comp-icon-size: var(--sg-comp-alert-icon-size);
			--sg-comp-icon-color: var(--sg-comp-alert-icon-color);

			flex-shrink: 0;
			height: 1lh;
      display: flex;
      align-items: center;
      justify-content: center;

			// Bring svg element over pseudo element overlay
			:global(svg) {
				z-index: 1;
			}

			&::before {
				content: '';
				display: block;
				width: calc(var(--sg-comp-alert-padding-x) * 2 + var(--sg-comp-icon-size) - 4px);
        height: calc(100% - 4px);
				flex-shrink: 0;
				position: absolute;
				top: 2px;
        left: 2px;
				bottom: 2px;
				z-index: 0;
        border-top-left-radius: calc(var(--sg-sys-border-radius) / 2);
        border-bottom-left-radius: calc(var(--sg-sys-border-radius) / 2);
        background-color: color-mix(in oklch, var(--sg-comp-alert-color) 50%, transparent);
			}
		}

		&__content {
				overflow: auto;
		}
	}

  .danger {
    --sg-comp-alert-color: var(--sg-sys-destructive);
  }

  .info {
    --sg-comp-alert-color: var(--sg-ref-blue-500);
  }

  .warning {
    --sg-comp-alert-color: var(--sg-ref-vermilion-300);
  }

  .success {
    --sg-comp-alert-color: var(--sg-ref-green-500);
  }
</style>

<script lang="ts" context="module">
	export type AlertVariant = 'info' | 'warning' | 'danger' | 'success';

	export interface AlertStyleOverrides {
		backgroundColor?: string;
		textColor?: string;
		textCentered?: boolean;
	}
</script>

<script lang="ts">
	export let size: 'normal' | 'slim' = 'normal';
	export let variant: AlertVariant | undefined;
	/**
	 * This sole purpose of this property is to support customization
	 * via the global settings (see settings.schema.json).
	 * This property should be used outside of this use case.
	 * Use {@link variant} instead.
	 */
	export let styleOverrides: AlertStyleOverrides = {};
</script>

<div
	role="alert"
	data-testid="alert-{variant}"
	class:info={variant === 'info'}
	class:warning={variant === 'warning'}
	class:danger={variant === 'danger'}
	class:success={variant === 'success'}
	class:slim={size === 'slim'}
	style:background-color={styleOverrides.backgroundColor}
	style:color={styleOverrides.textColor}
	style:text-align={styleOverrides.textCentered ? 'center' : undefined}
>
	<slot />
</div>

<style lang="scss">
	.danger {
		border-color: #dc3545 !important;
		background-color: rgba(220, 53, 69, 0.1) !important;
	}

	.info {
		border-color: #0b70db !important;
		background-color: rgba(11, 112, 219, 0.1) !important;
	}

	.warning {
		border-color: #ffc107 !important;
		background-color: rgba(255, 193, 7, 0.1) !important;
	}

	.success {
		border-color: #2ea043 !important;
		background-color: rgba(46, 160, 67, 0.1) !important;
	}

	.slim {
		padding: 0.25rem 0.5rem !important;
	}

	div {
		--alert-icon-display: block;
		--alert-icon-block-width: 2.5rem;
		--alert-content-padding: var(--sg-space-200);
		--alert-background-color: white;
		--alert-icon-color: var(--alert-border-color);

		overflow: auto;
		position: relative;
		color: var(--sg-sys-text-color);
		border-radius: var(--sg-sys-border-radius);
		border: 1px solid var(--alert-border-color);

		background-color: var(--alert-background-color);
		padding: var(--alert-content-padding) var(--alert-content-padding) var(--alert-content-padding)
			calc(var(--alert-icon-block-width) + var(--alert-content-padding));

		&::before,
		&::after {
			display: var(--alert-icon-display);
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: var(--alert-icon-block-width);
			height: 100%;
		}

		/* Alert icon background. */
		&::before {
			border: 2px solid white;
			border-top-left-radius: var(--sg-sys-border-radius);
			border-bottom-left-radius: var(--sg-sys-border-radius);
			background-color: var(--alert-icon-background-color);
		}

		&::after {
			mask-repeat: no-repeat;
			mask-size: 1rem;
			mask-position: 50% 50%;

			/* Applied as a fill color for SVG icon because of the mask-image. */
			background-color: var(--alert-icon-color);
		}
	}

	.danger {
		--alert-border-color: var(--sg-ref-red-500);
		--alert-icon-background-color: var(--sg-ref-red-100);

		:global(.theme-light) & {
			--alert-icon-color: var(--sg-ref-red-700);
		}

		:global(.theme-dark) & {
			--alert-icon-color: var(--sg-ref-red-500);
		}

		&::after {
			/* Icon: mdi/AlertCircle */
			mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M13 13h-2V7h2m0 10h-2v-2h2M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z'/></svg>");
		}
	}

	.info {
		--alert-border-color: var(--sg-ref-blue-600);
		--alert-icon-background-color: var(--sg-ref-blue-100);

		:global(.theme-light) & {
			--alert-icon-color: var(--sg-ref-blue-700);
		}

		:global(.theme-dark) & {
			--alert-icon-color: var(--sg-ref-blue-600);
		}

		&::after {
			/* Icon: mdi/Information */
			mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z'/></svg>");
		}
	}

	.warning {
		--alert-border-color: var(--sg-ref-orange-500);
		--alert-icon-background-color: var(--sg-ref-orange-100);

		:global(.theme-light) & {
			--alert-icon-color: var(--sg-ref-orange-700);
		}

		:global(.theme-dark) & {
			--alert-icon-color: var(--sg-ref-orange-500);
		}

		&::after {
			mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M13 14h-2V9h2m0 9h-2v-2h2M1 21h22L12 2 1 21z'/></svg>");
		}
	}

	.success {
		--alert-border-color: var(--sg-ref-green-600);
		--alert-icon-background-color: var(--sg-ref-green-100);

		:global(.theme-light) & {
			--alert-icon-color: var(--sg-ref-green-700);
		}

		:global(.theme-dark) & {
			--alert-icon-color: var(--sg-ref-green-600);
		}

		&::after {
			/* Icon: mdi-react/CheckCircle */
			mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/></svg>");
		}
	}

	.slim {
		border-radius: 0;
		border-width: 0 0 1px 0;
		background: var(--alert-icon-background-color);
		padding-left: var(--alert-content-padding);
		border-color: var(--sg-sys-border-color);

		&::before,
		&::after {
			display: none;
		}
	}
</style>

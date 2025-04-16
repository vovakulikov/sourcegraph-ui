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
	div {
		--alert-icon-display: block;
		--alert-icon-block-width: 2.5rem;
		--alert-content-padding: 0.5rem;
		--alert-background-color: #ffffff;

		overflow: auto;
		position: relative;
		color: #343a4d;
		border-radius: var(--border-radius);
		border: 1px solid (--alert-border-color);

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
			border: 2px solid var(--color-bg-1);
			border-top-left-radius: var(--border-radius);
			border-bottom-left-radius: var(--border-radius);
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
		--alert-border-color: red;
		--alert-icon-background-color: #fbeaea;

		:global(.theme-light) & {
			--alert-icon-color: #b52626;
		}

		:global(.theme-dark) & {
			--alert-icon-color: red;
		}

		&::after {
			/* Icon: mdi/AlertCircle */
			mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M13 13h-2V7h2m0 10h-2v-2h2M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z'/></svg>");
		}
	}

	.info {
		--alert-border-color: #0b70db;
		--alert-icon-background-color: #e1f0ff;
		:global(.theme-light) & {
			--alert-icon-color: #0864c6;
		}
		:global(.theme-dark) & {
			--alert-icon-color: #0b70db;
		}
		&::after {
			// Icon: mdi/Information
			mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2z'/></svg>");
		}
	}

	.warning {
		--alert-border-color: yellow;
		--alert-icon-background-color: #fff7e1;

		:global(.theme-light) & {
			--alert-icon-color: #e09200;
		}

		:global(.theme-dark) & {
			--alert-icon-color: yellow;
		}

		&::after {
			mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M13 14h-2V9h2m0 9h-2v-2h2M1 21h22L12 2 1 21z'/></svg>");
		}
	}

	.success {
		--alert-border-color: green;
		--alert-icon-background-color: #ebfaee;

		:global(.theme-light) & {
			--alert-icon-color: #319e44;
		}

		:global(.theme-dark) & {
			--alert-icon-color: green;
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
		border-color: var(--border-color-2);

		&::before,
		&::after {
			display: none;
		}
	}
</style>

<script lang="ts">
	interface LoadingSpinnerProps {
		/** Display spinner inline (as an inline element) */
		inline?: boolean;
		/** Center spinner within its container */
		center?: boolean;
		/** Custom inline styles for the spinner */
		style?: string;
	}

	const { inline = false, center = true, style = '' }: LoadingSpinnerProps = $props();
</script>

<div class:center class:inline data-loading-spinner {style}>
	<div class="loading-spinner" aria-label="loading" aria-live="polite"></div>
</div>

<style lang="scss">
	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.inline {
		display: contents;
	}

	.loading-spinner {
		width: var(--size, 1rem);
		height: var(--size, 1rem);
		flex-shrink: 0;
		flex-grow: 0;

		// Default colors from the design system
		--loading-spinner-outer-color: var(--sg-sys-border-color);
		--loading-spinner-inner-color: var(--sg-sys-accent-color);

		:global(.theme-light) & {
			--loading-spinner-outer-color: var(--sg-ref-gray-300);
			--loading-spinner-inner-color: var(--sg-ref-gray-800);
		}
		:global(.theme-dark) & {
			--loading-spinner-outer-color: var(--sg-ref-gray-700);
			--loading-spinner-inner-color: var(--sg-ref-gray-100);
		}

		.inline & {
			width: var(--icon-inline-size, 1em);
			height: var(--icon-inline-size, 1em);

			vertical-align: middle;
			display: inline-block;
		}

		border-radius: 50%;
		animation: loading-spinner-spin 1s linear infinite;
		border: 2px solid var(--loading-spinner-outer-color, rgba(0, 0, 0, 0.3));
		border-top: 2px solid var(--loading-spinner-inner-color, rgba(0, 0, 0, 1));
	}

	@keyframes loading-spinner-spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
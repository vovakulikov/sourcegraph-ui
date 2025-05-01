<script lang="ts">
	interface LoadingSpinnerProps {

		/** Display spinner inline (as an inline element) */
		inline?: boolean;

		/** Center spinner within its container */
		center?: boolean;
	}

	const { inline = false, center = true }: LoadingSpinnerProps = $props();
</script>

<div class:center class:inline data-loading-spinner>
	<div class="loading-spinner" aria-label="loading" aria-live="polite"></div>
</div>

<style lang="scss">
	:root {
		--sg-comp-spinner-size: 1rem;
		--sg-comp-spinner-inline-size: 1em;
		--sg-comp-spinner-outer-color: var(--sg-sys-border-color);
    --sg-comp-spinner-inner-color: var(--sg-sys-foreground);
	}

	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.loading-spinner {
		width: var(--sg-comp-spinner-size, 1rem);
		height: var(--sg-comp-spinner-size, 1rem);
		flex-shrink: 0;
		flex-grow: 0;
		border-radius: 50%;
		animation: loading-spinner-spin 1s linear infinite;
		border: 2px solid var(--sg-comp-spinner-outer-color);
		border-top: 2px solid var(--sg-comp-spinner-inner-color);
	}

  .inline {
    display: inline-block;
    vertical-align: middle;
    width: var(--sg-comp-spinner-inline-size);
    height: var(--sg-comp-spinner-inline-size);
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

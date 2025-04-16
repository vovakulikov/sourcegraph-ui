<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let props: HTMLInputAttributes = $props();
</script>

<input {...props} type="checkbox" />

<style lang="scss">
	input {
		/* Add if not using autoprefixer */
		-webkit-appearance: none;
		/* Remove most all native input styles */
		appearance: none;
		/* For iOS < 15 */
		background-color: var(--sg-sys-backgound);
		/* Not removed via appearance */
		margin: 0;

		font: inherit;
		color: currentColor;
		width: 1.5em;
		height: 1.5em;
		border: 0.15em solid var(--sg-sys-muted-text-color);
		box-shadow: var(--sg-shadow-100);
		cursor: pointer;
		border-radius: var(--sg-border-radius-100);
		transform: translateY(-0.075em);

		display: grid;
		place-content: center;

		&:hover {
			filter: brightness(1.3);
		}
	}

	input[type='checkbox']::before {
		content: '';
		width: 0.65em;
		height: 0.65em;
		clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
		transform: scale(0);
		box-shadow: inset 1em 1em currentColor;

		/* Windows High Contrast Mode */
		background-color: CanvasText;
	}

	input[type='checkbox']:checked {
		color: var(--sg-sys-accent-text-color);
		border-color: var(--sg-sys-accent-color);
		background-color: var(--sg-sys-accent-color);

		&::before {
			transform: scale(1);
		}
	}

	input[type='checkbox']:disabled {
		cursor: not-allowed;
		color: var(--sg-sys-muted-text-color);
		background-color: var(--sg-sys-background-light);

		&:checked {
			border-color: var(--sg-sys-accent-color-light);
			background-color: var(--sg-sys-accent-color-light);
		}
	}

	input[type='checkbox']:focus-visible {
		outline-offset: 0.15rem;
		outline: max(2px, 0.15em) solid var(--sg-sys-accent-color);

		// Turn off global input:focus-visible focus ring style
		box-shadow: none;
	}
</style>

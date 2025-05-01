<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes<HTMLInputElement> {
		elementRef: HTMLInputElement;
	}

	let { elementRef = $bindable(), ...attributes }: Props = $props();
</script>

<input bind:this={elementRef} {...attributes} type="checkbox" />

<style lang="scss">
	:root {
		--sg-comp-checkbox-size: 1.5em;
		--sg-comp-checkbox-color: var(--sg-sys-accent-foreground);
		--sg-comp-checkbox-border: var(--sg-sys-border-color);
    --sg-comp-checkbox-background: var(--sg-sys-background);
		--sg-comp-checkbox-box-shadow: var(--sg-shadow-100);
	}

  input::before {
    content: '';
    width: 0.65em;
    height: 0.65em;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    transform: scale(0);
    box-shadow: inset 1em 1em currentColor;

    /* Windows High Contrast Mode */
    background-color: CanvasText;
  }

	input {
    margin: 0;
		-webkit-appearance: none;
		appearance: none;
    display: grid;
    place-content: center;
		font: inherit;
    cursor: pointer;
    color: var(--sg-comp-checkbox-color);
    transform: translateY(-0.075em);
		width: var(--sg-comp-checkbox-size);
		height: var(--sg-comp-checkbox-size);
		border: 0.15em solid var(--sg-comp-checkbox-border);
		box-shadow: var(--sg-comp-checkbox-box-shadow);
		border-radius: var(--sg-sys-border-radius);
    background-color: var(--sg-comp-checkbox-background);

    &:focus-visible {
      --sg-comp-checkbox-border: var(--sg-sys-border-active-color);
      --sg-comp-checkbox-box-shadow: var(--sg-sys-focus-shadow);
    }

		&:checked, &:indeterminate {
      --sg-comp-checkbox-border: var(--sg-sys-accent);
      --sg-comp-checkbox-background: var(--sg-sys-accent);

      &::before {
        transform: scale(1);
      }

      &:hover {
        filter: brightness(1.2);
      }
		}

    &:indeterminate::before {
			width: 0.85rem;
      clip-path: polygon(0% 40%, 100% 40%, 100% 65%, 0% 65%);
		}

    &:disabled {
      opacity: 0.75;
      cursor: not-allowed;

      &:checked, &:indeterminate {
        --sg-comp-checkbox-color: var(--sg-sys-foreground);
        --sg-comp-checkbox-border: var(--sg-sys-muted-foreground);
        --sg-comp-checkbox-background: color-mix(in oklch, var(--sg-sys-muted-foreground) 50%, transparent);

        &:hover {
          filter: unset;
        }
      }
    }
	}
</style>

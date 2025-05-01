<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	type Status = 'normal' | 'valid' | 'invalid'

	interface SelectProps extends HTMLSelectAttributes {
		value?: string;
		options: { value: string; label: string }[];
		status?: Status
		valid?: boolean;
		error?: string | string[] | null;
	}

	let {
		value = $bindable(''),
		options,
		status,
		...attributes
	}: SelectProps = $props();
</script>

<select bind:value class='{status}' {...attributes}>
	{#each options ?? [] as option (option.value)}
		<option value={option.value}>{option.label ?? option.value}</option>
	{/each}
</select>

<style lang="scss">
	:root {
		--sg-comp-select-padding-y: 0.375rem;
		--sg-comp-select-padding-x: 0.75rem;
		--sg-comp-select-input-border: 1px;
    --sg-comp-select-line-height: calc(20 / 14);
    --sg-comp-select-background: var(--sg-sys-background);
		--sg-comp-select-font-size: 1rem;
		--sg-comp-select-color: var(--sg-sys-text-color);
		--sg-comp-select-border-color: var(--sg-sys-border-color);
    --sg-comp-select-border-active: var(--sg-sys-border-active-color);
    --sg-comp-select-focus-shadow-color: var(--sg-sys-accent);

		--sg-comp-select-height: calc(
            var(--sg-comp-select-line-height) * 1em
						+ var(--sg-comp-select-padding-y) * 2
						+ var(--sg-comp-select-input-border)
    );
		--sg-comp-select-background-image:
						url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23798baf' viewBox='0 0 24 24'%3e%3cpath d='M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42z'/%3e%3c/svg%3e")
						no-repeat right var(--sg-comp-select-padding-x) center/1rem 1rem;;
	}

	select {
		display: inline-block;
		width: 100%;
    height: var(--sg-comp-select-height);
    padding:
						var(--sg-comp-select-padding-y)
						calc(var(--sg-comp-select-padding-x) + 1.5rem)
						var(--sg-comp-select-padding-y)
						var(--sg-comp-select-padding-x);

		font-weight: 400;
    appearance: none;
    vertical-align: middle;
    background-clip: padding-box;
    text-transform: capitalize;

    font-size: var(--sg-comp-select-font-size);
    line-height: var(--sg-comp-select-line-height);
		color: var(--sg-comp-select-color);

		border: 1px solid var(--sg-comp-select-border-color);
		border-radius: var(--sg-sys-border-radius);

    background: var(--sg-comp-select-background) var(--sg-comp-select-background-image);
    background-position: right 0.75rem center;

    &:focus-visible {
      border-color: var(--sg-comp-select-border-active);
      box-shadow: 0 0 0 3px color-mix(in oklch, var(--sg-comp-select-focus-shadow-color) 65%, transparent);
		}


		&.is-invalid {
			border-color: var(--sg-ref-red-600);
		}
		
		&.is-valid {
			border-color: var(--sg-ref-green-600);
		}
		
		&:disabled {
			opacity: 0.65;
			cursor: not-allowed;
			pointer-events: none;
      background-color: var(--sg-sys-secondary);
		}
	}

	.invalid {
    --sg-comp-select-focus-shadow-color: var(--sg-sys-destructive);
    --sg-comp-select-border-color: var(--sg-sys-destructive);
    --sg-comp-select-border-active: var(--sg-sys-destructive);
	}

  .valid {
    --sg-comp-select-focus-shadow-color: var(--sg-ref-green-500);
    --sg-comp-select-border-color: var(--sg-ref-green-500);
    --sg-comp-select-border-active: var(--sg-ref-green-500);
  }

  .custom-select-sm {
    height: var(--input-height-sm);
    padding-top: var(--custom-select-padding-y-sm);
    padding-bottom: var(--custom-select-padding-y-sm);
    padding-left: var(--custom-select-padding-x-sm);
    font-size: 0.765625rem;
  }

  .custom-select-lg {
    height: var(--custom-select-height-lg);
    padding-top: var(--custom-select-padding-y-lg);
    padding-bottom: var(--custom-select-padding-y-lg);
    padding-left: var(--custom-select-padding-x-lg);
    font-size: 1.25rem;
  }
</style>

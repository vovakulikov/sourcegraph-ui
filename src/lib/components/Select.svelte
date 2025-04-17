<script lang="ts">
	import type { FormEventHandler, HTMLSelectAttributes } from 'svelte/elements';

	let {
		value = $bindable(''),
		options,
		onInput = undefined,
		valid = undefined,
		error = undefined,
		...props
	}: {
		value?: string;
		options?: { value: string; label?: string }[];
		onInput?: FormEventHandler<HTMLSelectElement>;
		valid?: boolean;
		error?: string | string[] | null;
	} & HTMLSelectAttributes = $props();
</script>

<div data-select-container>
	<select
		bind:value
		class={{ 'custom-select': true, 'is-invalid': error, 'is-valid': valid && !error }}
		oninput={onInput}
		{...props}
	>
		{#each options ?? [] as option (option.value)}
			<option value={option.value}>{option.label ?? option.value}</option>
		{/each}
	</select>

	{#if error}
		<small class="error">{error}</small>
	{/if}
</div>

<style lang="scss">
	[data-select-container] {
		width: 100%;
		display: block;
		position: relative;
	}

	:root {
    --input-line-height: calc(20 / 14);
    --input-padding-y: 0.375rem;
    --input-padding-x: 0.75rem;
    --input-height-border: 1px;

    --sg-comp-select-component: var(--sg-sys-background);

    --custom-select-height: calc(
            var(--input-line-height) * 1em + var(--input-padding-y) * 2 + var(--input-height-border)
    );

    --custom-select-background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23798baf' viewBox='0 0 24 24'%3e%3cpath d='M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42z'/%3e%3c/svg%3e")
    no-repeat right var(--input-padding-x) center/1rem 1rem;
	}

	select {
		display: inline-block;
		width: 100%;
    height: var(--custom-select-height);
    padding: var(--input-padding-y) calc(var(--input-padding-x) + 1rem) var(--input-padding-y) var(--input-padding-x);
		font-size: 1rem;
		font-weight: 400;
    line-height: var(--input-line-height);
		color: var(--sg-sys-text-color);
		background-color: var(--sg-sys-backgound);
		background-clip: padding-box;
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-border-radius-100);
		transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    vertical-align: middle;
    background: var(--sg-comp-select-component) var(--custom-select-background);
    appearance: none;
		background-clip: padding-box;
    background-position: right 0.75rem center;

    &:focus {
			border-color: var(--sg-sys-accent-color-light);
			outline: 0;
			box-shadow: var(--sg-sys-focus-shadow);
		}
		
		&.is-invalid {
			border-color: var(--sg-ref-red-600);
		}
		
		&.is-valid {
			border-color: var(--sg-ref-green-600);
		}
		
		&:disabled {
			background-color: var(--sg-sys-background-light);
			opacity: 0.65;
			cursor: not-allowed;
		}
	}

	.error {
		font-weight: normal;
		display: block;
		line-height: 1.3;
		margin-top: 0.5rem;
		color: var(--sg-ref-red-600);
		font-size: 0.875rem;

		&::first-letter {
			text-transform: uppercase;
		}
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

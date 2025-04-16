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
		class={{ 'form-control': true, 'is-invalid': error, 'is-valid': valid && !error }}
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

	select {
		display: block;
		width: 100%;
		padding: 0.375rem 0.75rem;
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.5;
		color: var(--sg-sys-text-color);
		background-color: var(--sg-sys-backgound);
		background-clip: padding-box;
		border: 1px solid var(--sg-sys-border-color);
		border-radius: var(--sg-border-radius-100);
		transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
		
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
</style>

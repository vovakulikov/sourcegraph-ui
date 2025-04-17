<script lang="ts">
	import { Combobox } from 'bits-ui';
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown';
	import Check from 'phosphor-svelte/lib/Check';
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
	import CaretDoubleUp from 'phosphor-svelte/lib/CaretDoubleUp';
	import CaretDoubleDown from 'phosphor-svelte/lib/CaretDoubleDown';
	
	interface ComboboxProps {
		options?: Array<{ value: string, label: string, disabled?: boolean }>;
		placeholder?: string;
		value?: string | string[];
		type?: 'single' | 'multiple';
		name?: string;
		disabled?: boolean;
		width?: string;
		ariaLabel?: string;
	}
	
	let {
		options = [],
		placeholder = 'Search...',
		value = $bindable(''),
		type = 'single',
		name = undefined,
		disabled = false,
		width = '296px',
		ariaLabel = undefined
	}: ComboboxProps = $props();

	// If ariaLabel is not provided, use placeholder
	const computedAriaLabel = $derived(ariaLabel || placeholder);

	let searchValue = $state('');

	$effect(() => {
		if (searchValue === '') {
			searchValue = '';
		}
	});
	
	const filteredOptions = $derived(
		searchValue === ''
			? options
			: options.filter((option) => 
				option.label.toLowerCase().includes(searchValue.toLowerCase())
			)
	);
</script>

<Combobox.Root
	{type}
	{name}
	{disabled}
	bind:value
	onOpenChange={(o) => {
		if (!o) searchValue = '';
	}}
>
	<div class="combobox-container">
		<MagnifyingGlass class="combobox-search-icon" />
		<Combobox.Input
			oninput={(e) => (searchValue = e.currentTarget.value)}
			class="combobox-input"
			style="width: {width}"
			{placeholder}
			{disabled}
			aria-label={computedAriaLabel}
		/>
		<Combobox.Trigger class="combobox-trigger">
			<CaretUpDown class="combobox-caret" />
		</Combobox.Trigger>
	</div>
	<Combobox.Portal>
		<Combobox.Content
			class="combobox-content"
			sideOffset={10}
		>
			<Combobox.ScrollUpButton class="combobox-scroll-button">
				<CaretDoubleUp class="combobox-scroll-icon" />
			</Combobox.ScrollUpButton>
			<Combobox.Viewport class="combobox-viewport">
				{#each filteredOptions as option, i (i + option.value)}
					<Combobox.Item
						class="combobox-item"
						value={option.value}
						label={option.label}
						disabled={option.disabled}
					>
						{#snippet children({ selected })}
							{option.label}
							{#if selected}
								<div class="combobox-check">
									<Check />
								</div>
							{/if}
						{/snippet}
					</Combobox.Item>
				{:else}
					<span class="combobox-no-results">
						No results found, try again.
					</span>
				{/each}
			</Combobox.Viewport>
			<Combobox.ScrollDownButton class="combobox-scroll-button">
				<CaretDoubleDown class="combobox-scroll-icon" />
			</Combobox.ScrollDownButton>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>

<style lang="scss">
	.combobox-container {
		position: relative;
		width: var(--width, auto);
	}

	:global(.combobox-search-icon) {
		color: var(--sg-sys-muted-text-color);
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		width: 24px;
		height: 24px;
	}

	:global(.combobox-input) {
		display: inline-flex;
		height: 40px;
		width: 100%;
		border-radius: var(--sg-border-radius-100);
		border: 1px solid var(--sg-sys-border-color);
		background-color: white;
		padding: 0.375rem 0.75rem;
		padding-left: 2.75rem; /* Space for search icon */
		padding-right: 2.75rem; /* Space for dropdown caret */
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.5;
		color: var(--sg-sys-text-color);
		transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
		
		&:focus {
			border-color: var(--sg-sys-accent-color-light);
			outline: 0;
			box-shadow: var(--sg-sys-focus-shadow);
		}
		
		&:disabled {
			background-color: var(--sg-sys-background-light);
			opacity: 0.65;
			cursor: not-allowed;
		}
	}

	:global(.combobox-trigger) {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		width: 24px;
		height: 24px;
		color: var(--sg-sys-muted-text-color);
		background: transparent;
		border: none;
		cursor: pointer;
	}

	:global(.combobox-caret) {
		width: 24px;
		height: 24px;
	}

	:global(.combobox-content) {
		z-index: 50;
		width: var(--bits-combobox-anchor-width);
		min-width: var(--bits-combobox-anchor-width);
		max-height: var(--bits-combobox-content-available-height);
		overflow: auto;
		border-radius: var(--sg-border-radius-100);
		border: 1px solid var(--sg-sys-border-color);
		background-color: white;
		box-shadow: var(--sg-shadow-200);
		margin-top: 4px;
		padding: 0.5rem;
	}

	:global(.combobox-scroll-button) {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		padding: 6px;
		color: var(--sg-sys-muted-text-color);
	}

	:global(.combobox-scroll-icon) {
		width: 20px;
		height: 20px;
	}

	:global(.combobox-viewport) {
		padding: 4px;
	}

	:global(.combobox-item) {
		display: flex;
		height: 40px;
		width: 100%;
		align-items: center;
		padding: 0.75rem 1.25rem;
		border-radius: var(--sg-border-radius-100);
		text-align: left;
		font-size: 0.875rem;
		cursor: pointer;
		
		&:hover, &[data-highlighted=true] {
			background-color: #f5f5f5;
		}
		
		&[aria-selected=true] {
			background-color: var(--sg-sys-accent-color);
			color: var(--sg-sys-accent-text-color);
		}
		
		&[data-disabled=true] {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	:global(.combobox-check) {
		margin-left: auto;
	}

	:global(.combobox-no-results) {
		display: block;
		padding: 0.5rem 1.25rem;
		font-size: 0.875rem;
		color: var(--sg-sys-muted-text-color);
	}
</style>
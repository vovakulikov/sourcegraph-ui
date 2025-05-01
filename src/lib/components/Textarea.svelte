<script module lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements'
	import type { IconComponent } from './icon/Icon.svelte'

	type Status = 'normal' | 'invalid' | 'valid' | 'loading'

	export interface TextareaProps extends HTMLTextareaAttributes {
		elementRef?: HTMLTextAreaElement
		resizable?: boolean
		status?: Status
	}

	// For normal state we don't have any icon, for loading state
	// we use LoadingSpinner instead of static Icon component.
	const STATUS_ICONS: Record<Exclude<Status, 'normal' | 'loading'>, IconComponent> = {
		invalid: ILucideCircleAlert,
		valid: ILucideCheck,
	}
</script>

<script lang="ts">
	import Icon from './icon/Icon.svelte'
	import LoadingSpinner from './LoadingSpinner.svelte'

	let {
		elementRef = $bindable(),
		value = $bindable(''),
		placeholder,
		status = 'normal',
		...props
	}: TextareaProps = $props()

	let hasIcon = $derived(status !== 'normal')
</script>

<div class="wrapper {status}">
	<textarea
		{...props}
		bind:this={elementRef}
		bind:value
		{placeholder}
		class='textarea resize-none {hasIcon ? "textarea--with-icon" : ""}'
	></textarea>

	{#if status !== 'normal'}
		<div class="icon">
			{#if status !== 'loading'}
				<Icon icon={STATUS_ICONS[status]} />
			{:else}
				<LoadingSpinner/>
			{/if}
		</div>
	{/if}
</div>


<style lang="scss">
	:root {
		--sg-comp-textarea-focus-shadow-color: var(--sg-sys-accent);
		--sg-comp-textarea-border-color: var(--sg-sys-border-color);
		--sg-comp-textarea-border-active: var(--sg-sys-border-active-color);
		--sg-comp-textarea-padding: 0.5rem;
	}

  .wrapper {
    --sg-comp-icon-size: 1lh;
    --sg-comp-spinner-size: 1lh;
    --sg-comp-icon-color: var(--sg-comp-textarea-border-active);

    width: 100%;
    position: relative;
  }

	.textarea {
		outline: none;
		width: 100%;
    padding: var(--sg-comp-textarea-padding);
    border-radius: var(--sg-sys-border-radius);
    border: 1px solid var(--sg-comp-textarea-border-color);
		color: var(--sg-sys-foreground);
		background-color: var(--sg-sys-input-background);

		&:focus-visible {
      border-color: var(--sg-comp-textarea-border-active);
			box-shadow: 0 0 0 3px color-mix(in oklch, var(--sg-comp-textarea-focus-shadow-color) 65%, transparent);
		}

		&::placeholder {
			color: var(--sg-sys-muted-foreground);
		}

		&:disabled {
			opacity: 0.75;
			cursor: not-allowed;
		}

		&--with-icon {
			padding-right: calc(var(--sg-comp-textarea-padding) * 2 + var(--sg-comp-icon-size));
		}
	}

  .icon {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
  }

	.invalid {
    --sg-comp-textarea-focus-shadow-color: var(--sg-sys-destructive);
    --sg-comp-textarea-border-color: var(--sg-sys-destructive);
    --sg-comp-textarea-border-active: var(--sg-sys-destructive);
	}

	.valid {
    --sg-comp-textarea-focus-shadow-color: var(--sg-ref-green-500);
    --sg-comp-textarea-border-color: var(--sg-ref-green-500);
    --sg-comp-textarea-border-active: var(--sg-ref-green-500);
	}

  .resize-none {
    resize: none;
  }
</style>

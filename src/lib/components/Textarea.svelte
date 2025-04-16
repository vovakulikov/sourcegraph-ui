<script module lang="ts">
	import type { FormEventHandler, HTMLTextareaAttributes } from 'svelte/elements'

	export interface TextareaProps extends HTMLTextareaAttributes {
		elementRef?: HTMLTextAreaElement
		valid?: boolean
		resizable?: boolean
		onInput?: FormEventHandler<HTMLTextAreaElement>
	}
</script>

<script lang="ts">
	let {
		elementRef = $bindable(),
		value = $bindable(''),
		placeholder,
		onInput,
		...props
	}: TextareaProps = $props()
</script>

<textarea
	{...props}
	bind:this={elementRef}
	bind:value
	{placeholder}
	class='resize-none'
	oninput={onInput}
></textarea>

<style lang="scss">
	textarea {
		width: 100%;
    padding: 0.5rem;
    border-radius: var(--sg-sys-border-radius);
    border: 1px solid var(--sg-sys-border-color);

		&:focus-visible {
			box-shadow: var(--sg-sys-focus-shadow);
			border-color: var(--sg-sys-border-active-color);
		}

		&::placeholder {
			color: var(--sg-sys-muted-text-color);
		}
	}

  .resize-none {
    resize: none;
  }
</style>

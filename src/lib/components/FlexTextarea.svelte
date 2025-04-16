<!--
@component
Flexible and auto-growable textarea element. This component uses standard Textarea
component and adds growth watch logic, you can control growing behavior with rows
props (see min/max rows props).
-->

<script module lang="ts">
	/**
	 *  Sync value of line height with our global styles
	 *  See line-height-base scss variable with 20/14 value.
	 */
	const DEFAULT_TEXTAREA_LINE_HEIGHT = 20
</script>

<script lang="ts">
	import Textarea, { type TextareaProps } from './Textarea.svelte'
	interface FlexTextareaProps extends TextareaProps {
		minRows?: number
		maxRows?: number
	}
	let {
		minRows = 1,
		maxRows = 5,
		value = $bindable(),
		elementRef = $bindable(),
		...otherProps
	}: FlexTextareaProps = $props()

	$effect(() => {
		if (!elementRef) {
			return
		}

		function recalculateRows() {
			if (!elementRef) {
				return
			}
			const previousRows = elementRef.rows
			const textareaLineHeight =
				parseFloat(getComputedStyle(elementRef).lineHeight) || DEFAULT_TEXTAREA_LINE_HEIGHT
			// reset number of rows in textarea
			elementRef.rows = minRows
			const currentRows = Math.max(Math.floor(elementRef.scrollHeight / textareaLineHeight), minRows)
			if (currentRows === previousRows) {
				elementRef.rows = currentRows
				return
			}
			if (currentRows > previousRows) {
				elementRef.scrollTop = elementRef.scrollHeight
			}
			elementRef.rows = Math.min(currentRows, maxRows)
		}

		// Align rows on initial render
		recalculateRows()
		elementRef.addEventListener('input', recalculateRows)

		return () => {
			elementRef?.removeEventListener('input', recalculateRows)
		}
	})
</script>

<Textarea resizable={false} bind:elementRef bind:value {...otherProps} />

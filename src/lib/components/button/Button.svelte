<script lang="ts" module>
	import clsx from 'clsx'

	import styles from './Button.module.scss'

	const BUTTON_VARIANTS = [
		'primary',
		'secondary',
		'success',
		'danger',
		'warning',
		'info',
		'merged',
		'link',
		'icon',
		'text',
	] as const

	const BUTTON_SIZES = ['small', 'large']

	interface GetButtonStyleParameters {
		variant: (typeof BUTTON_VARIANTS)[number]
		outline?: boolean
	}

	interface GetButtonSizeParameters {
		size: (typeof BUTTON_SIZES)[number]
	}

	interface GetButtonDotParameters {
		dot: boolean
	}

	console.log(styles)

	const getButtonStyle = ({ variant, outline }: GetButtonStyleParameters): string =>
		clsx(styles[`btn-${variant}` as keyof typeof styles], outline && styles.btnOutline)

	const getButtonSize = ({ size }: GetButtonSizeParameters): string =>
		styles[`btn-${size}` as keyof typeof styles]

	/**
	 * Returns the class name to style a button with the given options. This can be
	 * used to for generating the right CSS class combination for plain DOM buttons,
	 * but it should be used sparingly.
	 */
	export function getButtonClassName({ variant, size, outline, dot, }: Partial<
		GetButtonStyleParameters & GetButtonSizeParameters & GetButtonDotParameters
	> = {}): string {
		return clsx(
			styles.btn,
			variant && getButtonStyle({ variant, outline }),
			size && getButtonSize({ size }),
			dot && styles.btnWithDot
		)
	}

</script>
<script lang="ts">
	// In addition to the props explicitly listed here, this component also
	// accepts any HTMLButton attributes. Note that those will only be used when
	// the default implementation is used.

	import type { HTMLButtonAttributes, MouseEventHandler } from 'svelte/elements'
	import type { Snippet } from 'svelte'

	interface ButtonProps extends HTMLButtonAttributes {
		variant?: (typeof BUTTON_VARIANTS)[number]
		size?: (typeof BUTTON_SIZES)[number]
		outline?: boolean

		/**
		 * Add notification dot in the top right corner.
		 */
		dot?: boolean

		/**
		 * The content of the button. Only used if a custom button is not provided.
		 */
		children?: Snippet

		/**
		 * Allows the caller to render a custom element instead of the default button.
		 * The snippet is passed the CSS class(es) that would be applied to the button.
		 */
		custom?: Snippet<[string]>
	}

	let {
		variant = 'primary',
		size,
		outline,
		dot,
		children,
		custom,
		disabled,
		onclick,
		...restProps
	}: ButtonProps = $props()

	const handleClick: MouseEventHandler<HTMLButtonElement> = (event): void => {
		if (disabled) {
			// Prevent any native button element behaviour, such as submit
			// functionality if the button is used within form elements without
			// type attribute (or with explicitly set "submit" type.
			event.preventDefault()
			return
		}

		onclick?.(event)
	}

	let buttonClass = $derived(getButtonClassName({ variant, outline, size, dot }))
</script>

{#if custom}
	{@render custom(buttonClass)}
{:else}
	<button class={buttonClass} type="button" onclick={handleClick} aria-disabled={disabled} {...restProps}>
		{@render children?.()}
	</button>
{/if}

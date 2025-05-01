<script lang="ts" module>
	import clsx from 'clsx'
	import styles from './Button.module.scss'

	const BUTTON_VARIANTS = [
		'primary',
		'secondary',
		'text',
	] as const

	const BUTTON_SIZES = ['small', 'normal', 'large']

	interface GetButtonStyleParameters {
		variant: (typeof BUTTON_VARIANTS)[number]
	}

	interface GetButtonSizeParameters {
		size: (typeof BUTTON_SIZES)[number]
	}

	const getButtonStyle = ({ variant }: GetButtonStyleParameters): string =>
		clsx(styles[`btn--${variant}` as keyof typeof styles])

	const getButtonSize = ({ size }: GetButtonSizeParameters): string =>
		styles[`btn--${size}` as keyof typeof styles]

	/**
	 * Returns the class name to style a button with the given options. This can be
	 * used to for generating the right CSS class combination for plain DOM buttons,
	 * but it should be used sparingly.
	 */
	export function getButtonClassName({ variant, size}: Partial<
		GetButtonStyleParameters & GetButtonSizeParameters
	> = {}): string {
		return clsx(
			styles.btn,
			variant && getButtonStyle({ variant }),
			size && getButtonSize({ size }),
		)
	}

</script>
<script lang="ts">
	// In addition to the props explicitly listed here, this component also
	// accepts any HTMLButton attributes. Note that those will only be used when
	// the default implementation is used.

	import type { Snippet } from 'svelte'
	import type { HTMLButtonAttributes, MouseEventHandler } from 'svelte/elements'

	interface ButtonProps extends HTMLButtonAttributes {
		variant?: (typeof BUTTON_VARIANTS)[number]
		size?: (typeof BUTTON_SIZES)[number]

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

		// Start ripple effect
		const button = event.currentTarget;
		const rect = button.getBoundingClientRect()
		const circle = document.createElement("span");
		const diameter = Math.max(rect.width, rect.height);
		const radius = diameter / 2;

		circle.style.width = `${diameter}px`;
		circle.style.height = `${diameter}px`;
		circle.style.left = `${event.clientX - rect.left - radius}px`;
		circle.style.top = `${event.clientY - rect.top - radius}px`;
		circle.classList.add(styles.btnRipple);

		// Remove ripple element after animation is finished
		circle.addEventListener("animationend", (event) => circle.remove());
		button.appendChild(circle);

		onclick?.(event)
	}

	let buttonClass = $derived(getButtonClassName({ variant, size }))
</script>

{#if custom}
	{@render custom(buttonClass)}
{:else}
	<button
		type="button"
		class={buttonClass}
		aria-disabled={disabled}
		onclick={handleClick}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}

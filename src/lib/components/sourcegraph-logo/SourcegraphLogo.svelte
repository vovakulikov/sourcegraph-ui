<!-- @component
    Renders the Sourcegraph logo, pictogram with company name.

    When neither `width` nor `height` is provided the logo will be rendered at its default size.
    If either is provided the other will be left undefined so that the aspect ratio is preserved.

    If the logo is used in a context where layout shift is a concern it is recommended to specify both `width` and `height` or neither.

    The logo will automatically scale-down to fit into its container.
-->

<script module lang="ts">
	import logoLight from './sourcegraph-logo-light.svg'
	import logoDark from './sourcegraph-logo-dark.svg'

	type SourcegraphLogoVariance = 'light' | 'dark'

	const VARIANT_TO_SVG: Record<SourcegraphLogoVariance, string>  = {
		light: logoLight,
		dark: logoDark,
	}
</script>

<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements'

	interface Props extends HTMLImgAttributes {
		variant?: SourcegraphLogoVariance
	}

	let { variant = 'light', ...attributes }: Props = $props()

	let sizes = $derived(
		(attributes.width || attributes.height)
			? { width: attributes.width, height: attributes.height }
			: {
				// This is the default size of the new logo which we use for both, new and old logo, for better consistency.
				// Setting the size explicitly avoids layout shift when the image is loaded in.
				width: 292,
				height: 41,
			}
	)
</script>

<img
	src={VARIANT_TO_SVG[variant]}
	alt="Sourcegraph Logo"
	{...attributes}
	{...sizes}
/>

<style lang="scss">
  // object,
  img {
    max-width: 100%;
  }
</style>

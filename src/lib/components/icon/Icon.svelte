<!--
  @component
  Provides a convenient API to render SVG icons.

  Use Lucide icons by referring to them as `ILucide<IconName>`. For example:

      <Icon icon={ILucideChevronDown} />

  See https://lucide.dev/icons/ for a list of available icons.
-->
<script lang="ts" module>
	import type { Component } from 'svelte'
	import type { SVGAttributes } from 'svelte/elements'

	export type IconComponent = Component<
		SVGAttributes<SVGSVGElement> & { [key: `data-${string}`]: any }
	>
</script>

<script lang="ts">
	import styles from './Icon.module.scss'

	console.log(styles)

		interface Props extends SVGAttributes<SVGSVGElement> {
			/** The SVG icon component to render. */
			icon: IconComponent

			/** Render the icon inline next to text. */
			inline?: boolean
		}

		let { icon: Icon, inline, ...attributes }: Props = $props()
</script>

<Icon data-icon class='{styles.icon} {inline ? styles.iconInline : ""}' {...attributes} />

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
		interface Props extends SVGAttributes<SVGSVGElement> {
			/** The SVG icon component to render. */
			icon: IconComponent

			/** Render the icon inline next to text. */
			inline?: boolean
		}

		let { icon: Icon, inline, ...attributes }: Props = $props()
</script>

<Icon data-icon class={{ icon: true, 'icon-inline': inline }} {...attributes} />

<style lang="scss">

	:root {
		--sg-comp-icon-size: 1.5rem;
		--sg-comp-icon-inline-size: #{(16 / 14)}em;
		--sg-comp-icon-color: var(--sg-sys-muted-text-color);
		--sg-comp-icon-stroke-width: 2;
	}

  :global(.icon) {
    // Icon should never shrink when it's in a flex container
    flex: none;

    width: var(--sg-comp-icon-size);
    height: var(--sg-comp-icon-size);
    color: var(--sg-comp-icon-color);
    stroke-width: var(--sg-comp-icon-stroke-width);

    :global(g),
    :global(path) {
      // Overwrites Lucide's/unplugin-icons' default stroke-width setting
      stroke-width: inherit;
    }
  }

  :global(.icon-inline) {
    --sg-comp-icon-stroke-width: 2;

    flex: none;
    width: var(--sg-comp-icon-inline-size);
    height:  var(--sg-comp-icon-inline-size);
    vertical-align: text-bottom;
  }
</style>

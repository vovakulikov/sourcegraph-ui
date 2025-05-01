<script lang="ts">
    import { Icon } from '@sourcegraph/ui';
		import { CodeBlock, ComponentSandbox } from '$layouts'
</script>

<h2>Icon</h2>

<p>
	The Icon component provides a convenient way to display SVG icons, particularly Lucide icons.
	It includes styling and proper accessibility support. We also support our own collection of
	icons (for instance, see assets/symbol-icons set for symbols icons)
</p>

<ComponentSandbox title="Basic Usage" description="Basic usage of the Icon component with a Lucide icon.">
	{#snippet preview()}
		<Icon icon={ILucideHeart} />
	{/snippet}
	{#snippet code()}
			<CodeBlock code={`
<script>
	import { Icon } from 'sourcegraph-ui';
<\/script>

<Icon icon={ILucideHeart} />`.trim()} />
	{/snippet}
</ComponentSandbox>

<p>
	For using custom collection see documentation on setup your vite configuration with
	"UnpluginAutoImport" plugin.
</p>

<ComponentSandbox
	title="Custom icon collection"
	description="Besides Lucide we also provide our own custom set of icons, to use them add Sg prefix to the icon name instead of Lucide."
>
	{#snippet preview()}
		<Icon icon={ISgMark} />
		<Icon icon={ISymbolArray} />
		<Icon icon={ISymbolBoolean} />
		<Icon icon={ISymbolClass} />
		<Icon icon={ISymbolConstant} />
	{/snippet}
	{#snippet code()}
		<CodeBlock code={`
<script>
	import { Icon } from 'sourcegraph-ui';
<\/script>

<Icon icon={ISgMark} />`.trim()} />
	{/snippet}
</ComponentSandbox>

<script lang="ts">
    import { Icon } from '$lib';
    import CodeBlock from '$lib/layouts/CodeBlock.svelte'
    import ComponentSandbox from '$lib/layouts/ComponentSandbox.svelte';
</script>

<h2>Icon</h2>

<p>
	The Icon component provides a convenient way to display SVG icons, particularly Lucide icons.
	It includes styling and proper accessibility support.
</p>

<ComponentSandbox title="Basic Usage" description="Basic usage of the Icon component with a Lucide icon.">
	{#snippet preview()}
		<Icon icon={ILucideHeart} />
	{/snippet}
	{#snippet code()}
			<CodeBlock code={`
<script>
	import Icon from '$lib/components/Icon.svelte';
<\/script>

<Icon icon={ILucideHeart} />`.trim()} />
	{/snippet}
</ComponentSandbox>

<p>
	The Icon component provides a convenient way to display SVG icons, particularly Lucide icons.
	It includes styling and proper accessibility support.
</p>

<ComponentSandbox
	title="Custom icon collection"
	description="Besides Lucide we also provide our own custom set of icons, to use them add Sg prefix to the icon name instead of Lucide."
>
	{#snippet preview()}
		<Icon icon={ISgMark} />
	{/snippet}
	{#snippet code()}
		<CodeBlock code={`
<script>
	import Icon from '$lib/components/Icon.svelte';
<\/script>

<Icon icon={ILucideHeart} />`.trim()} />
	{/snippet}
</ComponentSandbox>

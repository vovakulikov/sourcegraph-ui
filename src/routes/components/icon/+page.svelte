<script lang="ts">
    import { Icon } from '$lib';
    import CodeBlock from '$lib/components/CodeBlock.svelte'
    import ComponentSandbox from '$lib/components/ComponentSandbox.svelte';
</script>

<h2>Icon</h2>

<p>
	The Icon component provides a convenient way to display SVG icons, particularly Lucide icons.
	It includes styling and proper accessibility support.
</p>

<ComponentSandbox title="Basic Usage" description="Basic usage of the Icon component with a Lucide icon.">
	<div slot="preview">
		<Icon icon={ISgMark} />
	</div>
	<div slot="code">
		<CodeBlock code={`<script>
  import Icon from '$lib/components/Icon.svelte';
  import { Heart } from 'lucide-svelte';
</script>

<Icon icon={Heart} />`} />
	</div>
</ComponentSandbox>
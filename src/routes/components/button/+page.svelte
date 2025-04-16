<script lang="ts">
	import { Icon, Button } from '$lib';
	import CodeBlock from '$lib/layouts/CodeBlock.svelte'
	import ComponentSandbox from '$lib/layouts/ComponentSandbox.svelte';
</script>

<h2>Button</h2>

<p>
	The Button component provides different variations to render a clickable UI elements, it also
	handles some corner cases for disabled state and ensures a proper ARIA-roles.
</p>

<ComponentSandbox title="Usage with icons" description="Basic usage of the Button component with a Lucide icon.">
	{#snippet preview()}
		<Button variant="primary">
			Get Started
			<Icon icon={ILucideArrowRight} inline/>
		</Button>
	{/snippet}
	{#snippet code()}
		<CodeBlock code={`
<script>
	import { Button } from '$lib';
<\/script>

<Button variant="primary">Get Started</Button>`.trim()} />
	{/snippet}
</ComponentSandbox>

<ComponentSandbox title="Usage with icons" description="Basic usage of the Button component with a Lucide icon.">
	{#snippet preview()}
		<Button variant="secondary">
			Get Started
			<Icon icon={ILucideArrowRight} inline/>
		</Button>
	{/snippet}
	{#snippet code()}
		<CodeBlock code={`
<script>
	import { Button } from '$lib';
<\/script>

<Button variant="secondary">Get Started</Button>`.trim()} />
	{/snippet}
</ComponentSandbox>


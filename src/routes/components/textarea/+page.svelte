<script lang="ts">
	import { Textarea, FlexTextarea } from '$lib';
	import CodeBlock from '$lib/layouts/CodeBlock.svelte'
	import ComponentSandbox from '$lib/layouts/ComponentSandbox.svelte';

	let value = $state('')
</script>

<h2>Icon</h2>

<p>
	The Textarea component renders a common textarea element and handles different validation and focus states.
</p>

<ComponentSandbox title="Basic Usage" description="Basic usage of the Icon component with a Lucide icon.">
	{#snippet preview()}
		<Textarea placeholder="Type something interesting of course if have anything fun to say, probably no, right ..."/>
	{/snippet}
	{#snippet code()}
		<CodeBlock code={`
<script>
	import { Textarea } from '$lib';
<\/script>

<Textarea
	placeholder="Type something interesting of course if have anything fun to say, probably no, right ..."
/>`.trim()} />
	{/snippet}
</ComponentSandbox>


<ComponentSandbox title="Growable textarea" description="Text area can be with dynamic sizes based on content.">
	{#snippet preview()}
		<FlexTextarea
			bind:value={value}
			placeholder="Look! It can grow as you type, try it, now"
			minRows={3}
			maxRows={10}
		/>
	{/snippet}
	{#snippet code()}
		<CodeBlock code={`
<script>
	import { Textarea } from '$lib';
<\/script>

<Textarea
	placeholder="Type something interesting of course if have anything fun to say, probably no, right ..."
/>`.trim()} />
	{/snippet}
</ComponentSandbox>

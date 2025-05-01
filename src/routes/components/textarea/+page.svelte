<script lang="ts">
	import { Textarea, FlexTextarea } from '$lib';
	import CodeBlock from '$layouts/CodeBlock.svelte'
	import ComponentSandbox from '$layouts/ComponentSandbox.svelte';

	let value = $state('')
</script>

<h2>Textarea</h2>

<p>
	The Textarea component renders a common textarea element and handles different validation and focus states.
</p>

<ComponentSandbox title="Basic Usage" description="Basic usage of the Icon component with a Lucide icon.">
	{#snippet preview()}
		<div class="rows">
			<Textarea placeholder="Type something interesting of course if have anything fun to say, probably no, right ..."/>
			<Textarea status="valid" placeholder="Type something interesting of course if have anything fun to say, probably no, right ..."/>
			<Textarea status="invalid" placeholder="Type something interesting of course if have anything fun to say, probably no, right ..."/>
			<Textarea status="loading" placeholder="Type something interesting of course if have anything fun to say, probably no, right ..."/>

			<Textarea disabled placeholder="Type something interesting of course if have anything fun to say, probably no, right ..."/>
		</div>
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

<ComponentSandbox title="Growable textarea" description="Flex textarea area can be with dynamic sizes based on content.">
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
	import { Flextextarea } from '$lib';
<\/script>

<Flextextarea
	placeholder="Type something interesting of course if have anything fun to say, probably no, right ..."
/>`.trim()} />
	{/snippet}
</ComponentSandbox>

<style lang="scss">
	.rows {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: stretch;
		justify-content: stretch;
	}
</style>

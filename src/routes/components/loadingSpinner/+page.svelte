<script lang="ts">
	import { LoadingSpinner } from '$lib';
	import CodeBlock from '$lib/layouts/CodeBlock.svelte';
	import ComponentSandbox from '$lib/layouts/ComponentSandbox.svelte';
</script>

<h2>LoadingSpinner</h2>

<p>
	The LoadingSpinner component provides a circular loading indicator to communicate that content is being loaded or processed.
</p>

<ComponentSandbox title="Basic Usage" description="Default loading spinner.">
	{#snippet preview()}
		<div style="height: 80px;">
			<LoadingSpinner />
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { LoadingSpinner } from '$lib';
</script>

<LoadingSpinner />`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox title="Inline Spinner" description="Spinner displayed inline with text.">
	{#snippet preview()}
		<div>
			<span>Loading data </span>
			<LoadingSpinner inline />
			<span> please wait</span>
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { LoadingSpinner } from '$lib';
</script>

<span>Loading data </span>
<LoadingSpinner inline />
<span> please wait</span>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="No Centering"
	description="Spinner without automatic centering in its container."
>
	{#snippet preview()}
		<div style="height: 80px; border: 1px solid var(--sg-sys-border-color); padding: 1rem;">
			<LoadingSpinner center={false} />
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { LoadingSpinner } from '$lib';
</script>

<div style="height: 80px;">
  <LoadingSpinner center={false} />
</div>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Custom Size"
	description="Spinner with a custom size using CSS variables."
>
	{#snippet preview()}
		<div style="height: 100px;">
			<LoadingSpinner style="--size: 2.5rem;" />
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { LoadingSpinner } from '$lib';
</script>

<LoadingSpinner style="--size: 2.5rem;" />`}
		/>
	{/snippet}
</ComponentSandbox>

<h3>LoadingSpinner API</h3>

<h4>Properties</h4>

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>inline</td>
			<td>boolean</td>
			<td>false</td>
			<td>Displays the spinner as an inline element, useful for embedding within text</td>
		</tr>
		<tr>
			<td>center</td>
			<td>boolean</td>
			<td>true</td>
			<td>Centers the spinner within its container using flexbox</td>
		</tr>
		<tr>
			<td>style</td>
			<td>string</td>
			<td>undefined</td>
			<td>Custom inline styles for the spinner, can be used to set custom size via --size variable</td>
		</tr>
	</tbody>
</table>

<h4>CSS Variables</h4>

<table>
	<thead>
		<tr>
			<th>Variable</th>
			<th>Description</th>
			<th>Default</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>--size</td>
			<td>Controls the width and height of the spinner</td>
			<td>1rem</td>
		</tr>
		<tr>
			<td>--loading-spinner-outer-color</td>
			<td>Color of the spinner's outer circle</td>
			<td>Theme dependent</td>
		</tr>
		<tr>
			<td>--loading-spinner-inner-color</td>
			<td>Color of the spinner's rotating segment</td>
			<td>Theme dependent</td>
		</tr>
	</tbody>
</table>

<style lang="scss">
	/* Table styles for API documentation */
	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	th,
	td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--sg-sys-border-color);
	}

	th {
		background-color: var(--sg-sys-background-light);
		font-weight: 600;
	}
</style>
<script lang="ts">
	import { Checkbox } from '$lib';
	import CodeBlock from '$layouts/CodeBlock.svelte';
	import ComponentSandbox from '$layouts/ComponentSandbox.svelte';

	let input: HTMLInputElement | null = $state(null)

	$inspect(input)
	$effect.pre(() => {
		if (!input) {
			return
		}

		input.indeterminate = true
	})
</script>

<h2>Checkbox</h2>

<p>
	The Checkbox component provides a styled checkbox input with accessibility support and various states.
	It includes custom styling while maintaining native checkbox functionality.
</p>

<ComponentSandbox title="Basic Usage" description="Default checkbox with no specified properties.">
	{#snippet preview()}
		<Checkbox />
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Checkbox } from 'sourcegraph-ui';
</script>

<Checkbox />`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Label Association"
	description="Use with a label element for better accessibility."
>
	{#snippet preview()}
		<div style="display: flex; align-items: center; gap: 0.5rem;">
			<Checkbox id="agree-checkbox" />
			<label for="agree-checkbox">I agree to the terms</label>
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Checkbox } from 'sourcegraph-ui';
</script>

<Checkbox id="agree-checkbox" />
<label for="agree-checkbox">I agree to the terms</label>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Checked State"
	description="Control the checked state with the checked attribute."
>
	{#snippet preview()}
		<div style="display: flex; flex-direction: column; gap: 0.5rem;">
			<div style="display: flex; align-items: center; gap: 0.5rem;">
				<Checkbox checked />
				<span>Checked</span>
			</div>
			<div style="display: flex; align-items: center; gap: 0.5rem;">
				<Checkbox />
				<span>Unchecked</span>
			</div>
			<div style="display: flex; align-items: center; gap: 0.5rem;">
				<Checkbox bind:elementRef={input} disabled/>
				<span>Intermediate</span>
			</div>
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Checkbox } from 'sourcegraph-ui';
</script>

<Checkbox checked />
<Checkbox />`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Disabled State"
	description="Disable the checkbox with the disabled attribute."
>
	{#snippet preview()}
		<div style="display: flex; flex-direction: column; gap: 0.5rem;">
			<div style="display: flex; align-items: center; gap: 0.5rem;">
				<Checkbox disabled />
				<span>Disabled unchecked</span>
			</div>
			<div style="display: flex; align-items: center; gap: 0.5rem;">
				<Checkbox disabled checked />
				<span>Disabled checked</span>
			</div>
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Checkbox } from 'sourcegraph-ui';
</script>

<Checkbox disabled />
<Checkbox disabled checked />`}
		/>
	{/snippet}
</ComponentSandbox>

<h3>Checkbox API</h3>

<h4>Properties</h4>

<p>The Checkbox component accepts all standard HTML input attributes:</p>

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
			<td>checked</td>
			<td>boolean</td>
			<td>false</td>
			<td>Controls the checked state of the checkbox</td>
		</tr>
		<tr>
			<td>disabled</td>
			<td>boolean</td>
			<td>false</td>
			<td>Disables the checkbox when true</td>
		</tr>
		<tr>
			<td>id</td>
			<td>string</td>
			<td>undefined</td>
			<td>ID to associate with a label element</td>
		</tr>
		<tr>
			<td>name</td>
			<td>string</td>
			<td>undefined</td>
			<td>Name attribute for form submission</td>
		</tr>
		<tr>
			<td>value</td>
			<td>string</td>
			<td>undefined</td>
			<td>Value to use when submitting a form</td>
		</tr>
	</tbody>
</table>

<p>
	Additionally, the component accepts any HTML input attributes that can be used with a standard checkbox
	input.
</p>

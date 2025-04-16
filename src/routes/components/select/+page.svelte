<script lang="ts">
	import { Select } from '$lib';
	import CodeBlock from '$lib/layouts/CodeBlock.svelte';
	import ComponentSandbox from '$lib/layouts/ComponentSandbox.svelte';

	const exampleOptions = [
		{ value: '', label: 'Select an option' },
		{ value: 'option1', label: 'Option 1' },
		{ value: 'option2', label: 'Option 2' },
		{ value: 'option3', label: 'Option 3' }
	];

	const fruitOptions = [
		{ value: '', label: 'Choose a fruit' },
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' },
		{ value: 'durian', label: 'Durian' },
		{ value: 'elderberry', label: 'Elderberry' }
	];
</script>

<h2>Select</h2>

<p>
	The Select component provides a styled dropdown menu for selecting from a list of options. It includes
	support for validation states and error messaging.
</p>

<ComponentSandbox title="Basic Usage" description="Default select dropdown with options.">
	{#snippet preview()}
		<Select options={exampleOptions} />
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Select } from '$lib';

  const options = [
    { value: '', label: 'Select an option' },
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];
</script>

<Select options={options} />`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="With Selected Value"
	description="Select with a pre-selected value."
>
	{#snippet preview()}
		<Select options={fruitOptions} value="banana" />
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Select } from '$lib';

  const fruitOptions = [
    { value: '', label: 'Choose a fruit' },
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' }
  ];
</script>

<Select options={fruitOptions} value="banana" />`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Required Field"
	description="Required select field with validation."
>
	{#snippet preview()}
		<Select options={exampleOptions} required aria-label="Required field" />
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Select } from '$lib';
  
  const options = [
    { value: '', label: 'Select an option' },
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ];
</script>

<Select options={options} required aria-label="Required field" />`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Validation States"
	description="Select with valid and invalid states."
>
	{#snippet preview()}
		<div style="display: flex; flex-direction: column; gap: 1rem;">
			<div>
				<label for="valid-select">Valid selection:</label>
				<Select id="valid-select" options={fruitOptions} value="apple" valid />
			</div>
			<div>
				<label for="invalid-select">Invalid selection:</label>
				<Select
					id="invalid-select"
					options={fruitOptions}
					value=""
					error="Please select a fruit"
				/>
			</div>
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Select } from '$lib';

  const fruitOptions = [
    { value: '', label: 'Choose a fruit' },
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' }
  ];
</script>

<!-- Valid state -->
<label for="valid-select">Valid selection:</label>
<Select id="valid-select" options={fruitOptions} value="apple" valid />

<!-- Invalid state with error message -->
<label for="invalid-select">Invalid selection:</label>
<Select
  id="invalid-select"
  options={fruitOptions}
  value=""
  error="Please select a fruit"
/>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Disabled Select"
	description="Disabled select field."
>
	{#snippet preview()}
		<Select options={exampleOptions} value="option1" disabled />
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Select } from '$lib';

  const options = [
    { value: '', label: 'Select an option' },
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ];
</script>

<Select options={options} value="option1" disabled />`}
		/>
	{/snippet}
</ComponentSandbox>

<h3>Select API</h3>

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
			<td>value</td>
			<td>string</td>
			<td>''</td>
			<td>The currently selected value</td>
		</tr>
		<tr>
			<td>options</td>
			<td>Array</td>
			<td>[]</td>
			<td>Array of option objects with value and label properties</td>
		</tr>
		<tr>
			<td>valid</td>
			<td>boolean</td>
			<td>undefined</td>
			<td>Indicates if the current selection is valid</td>
		</tr>
		<tr>
			<td>error</td>
			<td>string | string[] | null</td>
			<td>undefined</td>
			<td>Error message to display when the selection is invalid</td>
		</tr>
		<tr>
			<td>onInput</td>
			<td>Function</td>
			<td>undefined</td>
			<td>Event handler for the input event</td>
		</tr>
	</tbody>
</table>

<p>
	The Select component also accepts all standard HTML select attributes, such as <code>required</code>,
	<code>disabled</code>, <code>name</code>, <code>id</code>, etc.
</p>

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

	code {
		background-color: var(--sg-sys-background-light);
		padding: 0.2rem 0.4rem;
		border-radius: var(--sg-border-radius-100);
		font-family: var(--sg-sys-font-family-code);
		font-size: 0.875em;
	}
</style>
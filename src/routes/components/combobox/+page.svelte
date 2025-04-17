<script lang="ts">
	import { Combobox } from '$lib';
	import CodeBlock from '$lib/layouts/CodeBlock.svelte';
	import ComponentSandbox from '$lib/layouts/ComponentSandbox.svelte';

	const fruitOptions = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' },
		{ value: 'durian', label: 'Durian' },
		{ value: 'elderberry', label: 'Elderberry' }
	];

	const colorOptions = [
		{ value: 'red', label: 'Red' },
		{ value: 'green', label: 'Green' },
		{ value: 'blue', label: 'Blue' },
		{ value: 'yellow', label: 'Yellow' },
		{ value: 'purple', label: 'Purple' },
		{ value: 'orange', label: 'Orange' },
		{ value: 'pink', label: 'Pink' }
	];

	const countryOptions = [
		{ value: 'us', label: 'United States' },
		{ value: 'ca', label: 'Canada' },
		{ value: 'mx', label: 'Mexico' },
		{ value: 'br', label: 'Brazil' },
		{ value: 'ar', label: 'Argentina' },
		{ value: 'uk', label: 'United Kingdom' },
		{ value: 'fr', label: 'France' },
		{ value: 'de', label: 'Germany' },
		{ value: 'es', label: 'Spain' },
		{ value: 'it', label: 'Italy' },
		{ value: 'jp', label: 'Japan' },
		{ value: 'cn', label: 'China' },
		{ value: 'in', label: 'India' },
		{ value: 'au', label: 'Australia' }
	];
</script>

<h2>Combobox</h2>

<p>
	The Combobox component combines a text input with a dropdown selection menu, allowing users to
	either type to search or select from a list of options. It's particularly useful for selecting from
	large lists of items.
</p>

<ComponentSandbox title="Basic Usage" description="Default combobox with searchable options.">
	{#snippet preview()}
		<Combobox options={fruitOptions} placeholder="Search fruits..." />
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Combobox } from '$lib';

  const fruitOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'durian', label: 'Durian' },
    { value: 'elderberry', label: 'Elderberry' }
  ];
</script>

<Combobox options={fruitOptions} placeholder="Search fruits..." />`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Multiple Selection"
	description="Combobox that allows selecting multiple options."
>
	{#snippet preview()}
		<Combobox 
			options={colorOptions} 
			placeholder="Select colors..." 
			type="multiple"
		/>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Combobox } from '$lib';

  const colorOptions = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' }
  ];
</script>

<Combobox 
  options={colorOptions} 
  placeholder="Select colors..." 
  type="multiple"
/>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Custom Width"
	description="Combobox with customized width."
>
	{#snippet preview()}
		<Combobox 
			options={fruitOptions} 
			placeholder="Search fruits..." 
			width="400px"
		/>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Combobox } from '$lib';
  
  const fruitOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' }
  ];
</script>

<Combobox 
  options={fruitOptions} 
  placeholder="Search fruits..." 
  width="400px"
/>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Disabled State"
	description="Disabled combobox."
>
	{#snippet preview()}
		<Combobox 
			options={fruitOptions} 
			placeholder="Search fruits..." 
			disabled
		/>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Combobox } from '$lib';
  
  const fruitOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' }
  ];
</script>

<Combobox 
  options={fruitOptions} 
  placeholder="Search fruits..." 
  disabled
/>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Long List with Scrolling"
	description="Combobox with a long list of options that shows scrolling functionality."
>
	{#snippet preview()}
		<Combobox 
			options={countryOptions} 
			placeholder="Select a country..." 
		/>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Combobox } from '$lib';
  
  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },
    { value: 'br', label: 'Brazil' },
    { value: 'ar', label: 'Argentina' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
    // ...more countries
  ];
</script>

<Combobox 
  options={countryOptions} 
  placeholder="Select a country..." 
/>`}
		/>
	{/snippet}
</ComponentSandbox>

<h3>Combobox API</h3>

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
			<td>options</td>
			<td>Array</td>
			<td>[]</td>
			<td>Array of option objects with value and label properties</td>
		</tr>
		<tr>
			<td>placeholder</td>
			<td>string</td>
			<td>'Search...'</td>
			<td>Placeholder text for the input field</td>
		</tr>
		<tr>
			<td>value</td>
			<td>string | string[]</td>
			<td>''</td>
			<td>The selected value(s)</td>
		</tr>
		<tr>
			<td>type</td>
			<td>string</td>
			<td>'single'</td>
			<td>Selection type: 'single' or 'multiple'</td>
		</tr>
		<tr>
			<td>name</td>
			<td>string</td>
			<td>undefined</td>
			<td>Name attribute for form submission</td>
		</tr>
		<tr>
			<td>disabled</td>
			<td>boolean</td>
			<td>false</td>
			<td>Whether the combobox is disabled</td>
		</tr>
		<tr>
			<td>width</td>
			<td>string</td>
			<td>'296px'</td>
			<td>Width of the combobox input</td>
		</tr>
		<tr>
			<td>ariaLabel</td>
			<td>string</td>
			<td>same as placeholder</td>
			<td>ARIA label for accessibility</td>
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

	code {
		background-color: var(--sg-sys-background-light);
		padding: 0.2rem 0.4rem;
		border-radius: var(--sg-border-radius-100);
		font-family: var(--sg-sys-font-family-code);
		font-size: 0.875em;
	}
</style>
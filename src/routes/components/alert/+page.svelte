<script lang="ts">
	import { Alert } from '$lib';
	import CodeBlock from '$lib/layouts/CodeBlock.svelte';
	import ComponentSandbox from '$lib/layouts/ComponentSandbox.svelte';
</script>

<h2>Alert</h2>

<p>
	Alerts display important messages to users. Use them to communicate status, provide feedback, or
	highlight important information.
</p>

<ComponentSandbox title="Basic Usage" description="Basic alert with default styling.">
	{#snippet preview()}
		<Alert>This is a default alert with no variant specified.</Alert>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`import { Alert } from '$lib';

<Alert>This is a default alert with no variant specified.</Alert>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Alert Variants"
	description="Alerts come in different semantic variants to convey different types of messages."
>
	{#snippet preview()}
		<div style="display: flex; flex-direction: column; gap: 0.5rem;">
			<Alert variant="info">This is an info alert with important information.</Alert>
			<Alert variant="warning">This is a warning alert that requires attention.</Alert>
			<Alert variant="danger">This is a danger alert about a critical issue.</Alert>
			<Alert variant="success">This is a success alert confirming a completed action.</Alert>
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`import { Alert } from '$lib';

<Alert variant="info">This is an info alert with important information.</Alert>
<Alert variant="warning">This is a warning alert that requires attention.</Alert>
<Alert variant="danger">This is a danger alert about a critical issue.</Alert>
<Alert variant="success">This is a success alert confirming a completed action.</Alert>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Alert Sizes"
	description="Alerts can be displayed in normal or slim sizes."
>
	{#snippet preview()}
		<div style="display: flex; flex-direction: column; gap: 0.5rem;">
			<Alert variant="info">This is a normal alert with default padding.</Alert>
			<Alert variant="info" size="slim">This is a slim alert with reduced padding.</Alert>
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`import { Alert } from '$lib';

<Alert variant="info">This is a normal alert with default padding.</Alert>
<Alert variant="info" size="slim">This is a slim alert with reduced padding.</Alert>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Custom Styling"
	description="Alerts can be customized with the styleOverrides property."
>
	{#snippet preview()}
		<div style="display: flex; flex-direction: column; gap: 0.5rem;">
			<Alert variant="info" styleOverrides={{ backgroundColor: '#f0f8ff', textColor: '#003366' }}>
				This alert has custom background and text colors.
			</Alert>
			<Alert variant="warning" styleOverrides={{ textCentered: true }}>
				This alert has centered text.
			</Alert>
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`import { Alert } from '$lib';

// Custom background and text colors
<Alert
  variant="info"
  styleOverrides={{ backgroundColor: '#f0f8ff', textColor: '#003366' }}
>
  This alert has custom background and text colors.
</Alert>

// Centered text
<Alert
  variant="warning"
  styleOverrides={{ textCentered: true }}
>
  This alert has centered text.
</Alert>`}
		/>
	{/snippet}
</ComponentSandbox>

<h3>Alert API</h3>

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
			<td>variant</td>
			<td>'info' | 'warning' | 'danger' | 'success'</td>
			<td>undefined</td>
			<td>The visual style of the alert.</td>
		</tr>
		<tr>
			<td>size</td>
			<td>'normal' | 'slim'</td>
			<td>'normal'</td>
			<td>Controls the padding and density of the alert.</td>
		</tr>
		<tr>
			<td>styleOverrides</td>
			<td>AlertStyleOverrides</td>
			<td>Empty object</td>
			<td>Custom styling options for the alert.</td>
		</tr>
	</tbody>
</table>

<h4>AlertStyleOverrides Interface</h4>

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>backgroundColor</td>
			<td>string | undefined</td>
			<td>Custom background color for the alert.</td>
		</tr>
		<tr>
			<td>textColor</td>
			<td>string | undefined</td>
			<td>Custom text color for the alert.</td>
		</tr>
		<tr>
			<td>textCentered</td>
			<td>boolean | undefined</td>
			<td>Whether the alert text should be centered.</td>
		</tr>
	</tbody>
</table>

<h3>Accessibility</h3>

<p>
	The Alert component uses the <code>role="alert"</code> attribute to ensure proper accessibility. Screen
	readers will announce the alert content when it appears on the page.
</p>

<style lang="scss">
	/* Fix alert styling in examples */
	:global([role='alert']) {
		overflow: auto;
		position: relative;
		padding: 0.5rem !important;
		margin-bottom: 0.5rem;
		border-radius: 4px !important;
		border-width: 1px !important;
		border-style: solid !important;
	}

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

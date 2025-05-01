<script lang="ts">
	import { Alert } from '$lib';
	import CodeBlock from '$layouts/CodeBlock.svelte';
	import ComponentSandbox from '$layouts/ComponentSandbox.svelte';
</script>

<h2>Alert</h2>

<p>
	Alerts display important messages to users. Use them to communicate status, provide feedback, or
	highlight important information.
</p>

<ComponentSandbox title="Basic Usage" description="Basic alert with default styling.">
	{#snippet preview()}
		<Alert>This is a default alert with no variant specified. This is a default alert with no variant specified.</Alert>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Alert } from 'sourcegraph-ui';
</script>

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
			code={`<script>
  import { Alert } from 'sourcegraph-ui';
</script>

<Alert variant="info">This is an info alert with important information.</Alert>
<Alert variant="warning">This is a warning alert that requires attention.</Alert>
<Alert variant="danger">This is a danger alert about a critical issue.</Alert>
<Alert variant="success">This is a success alert confirming a completed action.</Alert>`}
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
	</tbody>
</table>

<h3>Accessibility</h3>

<p>
	The Alert component uses the <code>role="alert"</code> attribute to ensure proper accessibility. Screen
	readers will announce the alert content when it appears on the page.
</p>


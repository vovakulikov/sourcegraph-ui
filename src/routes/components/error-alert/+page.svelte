<script lang="ts">
	import { ErrorAlert } from '$lib';
	import CodeBlock from '$lib/layouts/CodeBlock.svelte';
	import ComponentSandbox from '$lib/layouts/ComponentSandbox.svelte';

	// Mock implementation of GraphQL errors for examples
	class MockGraphQLError {
		networkError?: Error;
		graphQLErrors: { message: string }[];

		constructor(options: { networkError?: Error; graphQLErrors?: { message: string }[] }) {
			this.networkError = options.networkError;
			this.graphQLErrors = options.graphQLErrors || [];
		}
	}
</script>

<h2>ErrorAlert</h2>

<p>
	ErrorAlert is a specialized alert component designed specifically for displaying error messages.
	It extends the base Alert component with added functionality for handling different types of
	errors, including GraphQL errors.
</p>

<ComponentSandbox title="Basic Usage" description="Basic error message display.">
	{#snippet preview()}
		<ErrorAlert error="This is a simple error message" />
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { ErrorAlert } from 'sourcegraph-ui';
</script>

<ErrorAlert error="This is a simple error message" />`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="With Title"
	description="Add a title to provide more context about the error."
>
	{#snippet preview()}
		<ErrorAlert
			title="Operation Failed"
			error="Unable to process your request due to a system error."
		/>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { ErrorAlert } from 'sourcegraph-ui';
</script>

<ErrorAlert
  title="Operation Failed"
  error="Unable to process your request due to a system error."
/>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox title="With Error Object" description="Pass a JavaScript Error object.">
	{#snippet preview()}
		<ErrorAlert error={new Error('Something went wrong with the application.')} />
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { ErrorAlert } from 'sourcegraph-ui';

  // Create an Error object
  const error = new Error("Something went wrong with the application.");
</script>

<ErrorAlert error={error} />`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Multiple Error Messages"
	description="Displays a list of error messages when multiple errors are provided."
>
	{#snippet preview()}
		<ErrorAlert
			title="Multiple Issues Detected"
			error={new MockGraphQLError({
				graphQLErrors: [
					{ message: "Field 'user' is not defined" },
					{ message: 'Network timeout occurred' },
					{ message: 'Authentication required' }
				]
			})}
		/>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { ErrorAlert } from 'sourcegraph-ui';

  // Create an object with GraphQL errors
  const error = {
    graphQLErrors: [
      { message: "Field 'user' is not defined" },
      { message: "Network timeout occurred" },
      { message: "Authentication required" }
    ]
  };
</script>

<ErrorAlert
  title="Multiple Issues Detected"
  error={error}
/>`}
		/>
	{/snippet}
</ComponentSandbox>

<h3>ErrorAlert API</h3>

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
			<td>title</td>
			<td>string | undefined</td>
			<td>undefined</td>
			<td>Optional title for the error alert.</td>
		</tr>
		<tr>
			<td>error</td>
			<td>ErrorLike | GraphQLError | unknown</td>
			<td>Required</td>
			<td>The error to display. Can be a string, Error object, GraphQL error object, or any object with a message property.</td>
		</tr>
	</tbody>
</table>

<h3>Types</h3>

<p>The component handles several different error types:</p>

<ul>
	<li><code>ErrorLike</code>: Any object with a message property</li>
	<li><code>GraphQL Error</code>: Object with graphQLErrors array and optional networkError</li>
	<li><code>string</code>: Plain error message</li>
	<li><code>unknown</code>: Fallback to "Unknown error"</li>
</ul>

<h3>Accessibility</h3>

<p>
	The ErrorAlert component inherits accessibility features from the Alert component, using <code
		>role="alert"</code
	> to ensure proper announcement by screen readers. Multiple error messages are presented in a semantically
	correct unordered list for better screen reader navigation.
</p>

<h3>Best Practices</h3>

<ul>
	<li>Use clear, concise error messages that explain what went wrong</li>
	<li>When appropriate, provide guidance on how to resolve the error</li>
	<li>
		For form validation errors, consider using inline validation feedback instead of an ErrorAlert
	</li>
	<li>For multiple related errors, use the title to provide context about the error group</li>
</ul>

<style lang="scss">
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
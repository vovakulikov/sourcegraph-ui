<!--
  @component
  This component renders an <Alert variant="danger"> with an error message. If the component is
  passed a CombinedError object from a GraphQL query, it will display all unique error messages.
-->
<script lang="ts">
	// We create our own simplified CombinedError type to avoid direct dependency on @urql/core
	interface GraphQLError {
		message?: string;
	}

	interface SimplifiedCombinedError {
		networkError?: Error;
		graphQLErrors: GraphQLError[];
	}

	interface ErrorLike {
		message: string;
		name?: string;
	}

	export const isErrorLike = (value: unknown): value is ErrorLike =>
		typeof value === 'object' &&
		value !== null &&
		('stack' in value || 'message' in value) &&
		!('__typename' in value);

	// Check if an object matches the CombinedError structure
	function isCombinedError(error: unknown): error is SimplifiedCombinedError {
		return (
			typeof error === 'object' &&
			error !== null &&
			'graphQLErrors' in error &&
			Array.isArray((error as any).graphQLErrors)
		);
	}

	import Alert from './Alert.svelte';

	export let title: string | undefined = undefined;
	export let error: ErrorLike | SimplifiedCombinedError | unknown;

	$: messages = getErrorMessage(error);

	function getErrorMessage(error: ErrorLike | SimplifiedCombinedError | unknown): string[] {
		if (isCombinedError(error)) {
			const messages: string[] = [];

			if (error.networkError) {
				messages.push(error.networkError.message);
			}

			// Deduplicate error messages. We can get the same error message multiple times
			// for different fields in the same query.
			for (const graphqlError of error.graphQLErrors) {
				if (graphqlError.message && !messages.includes(graphqlError.message)) {
					messages.push(graphqlError.message);
				}
			}

			return messages;
		}

		if (isErrorLike(error)) {
			return [error.message];
		}

		if (typeof error === 'string') {
			return [error];
		}

		return ['Unknown error'];
	}
</script>

<Alert variant="danger">
	{#if title}
		<h4>{title}</h4>
	{/if}
	{#if messages.length > 1}
		<ul>
			{#each messages as message}
				<li>{message}</li>
			{/each}
		</ul>
	{:else}
		{messages[0]}
	{/if}
</Alert>

<style lang="scss">
	ul {
		padding-inline-start: 3rem;
		list-style: disc;
	}

	h4 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		line-height: 1.2;
	}
</style>
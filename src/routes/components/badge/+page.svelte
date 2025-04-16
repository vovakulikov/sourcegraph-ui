<script lang="ts">
	import { Badge, BADGE_VARIANTS } from '$lib';
	import CodeBlock from '$lib/layouts/CodeBlock.svelte';
	import ComponentSandbox from '$lib/layouts/ComponentSandbox.svelte';
	
	// Simple function to use for the custom badge example
	function customBadgeRenderer({className}: {className: string}) {
		return `<a href="#badge-docs" class="${className}">Link Badge</a>`;
	}
</script>

<h2>Badge</h2>

<p>
	Badges are compact visual indicators used to highlight statuses, counts, or categorize items.
	They're ideal for drawing attention to important information or providing contextual labels.
</p>

<ComponentSandbox
	title="Basic Usage"
	description="Default badge with no specified variant."
>
	{#snippet preview()}
		<Badge>Default</Badge>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Badge } from '$lib';
</script>

<Badge>Default</Badge>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Variants"
	description="Badges come in various semantic variants to convey different meanings."
>
	{#snippet preview()}
		<div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
			<Badge variant="primary">primary</Badge>
			<Badge variant="secondary">secondary</Badge>
			<Badge variant="success">success</Badge>
			<Badge variant="danger">danger</Badge>
			<Badge variant="warning">warning</Badge>
			<Badge variant="info">info</Badge>
			<Badge variant="merged">merged</Badge>
			<Badge variant="outlineSecondary">outlineSecondary</Badge>
			<Badge variant="link">link</Badge>
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Badge } from '$lib';
</script>

<Badge variant="primary">primary</Badge>
<Badge variant="secondary">secondary</Badge>
<Badge variant="success">success</Badge>
<Badge variant="danger">danger</Badge>
<Badge variant="warning">warning</Badge>
<Badge variant="info">info</Badge>
<Badge variant="merged">merged</Badge>
<Badge variant="outlineSecondary">outlineSecondary</Badge>
<Badge variant="link">link</Badge>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Size"
	description="Badges can be rendered in standard or small sizes."
>
	{#snippet preview()}
		<div style="display: flex; gap: 0.5rem; align-items: center;">
			<Badge variant="primary">Standard</Badge>
			<Badge variant="primary" small>Small</Badge>
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Badge } from '$lib';
</script>

<Badge variant="primary">Standard</Badge>
<Badge variant="primary" small>Small</Badge>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Pill Badge"
	description="Badges can be displayed with rounded pill styling by setting the pill property."
>
	{#snippet preview()}
		<div style="display: flex; gap: 0.5rem; align-items: center;">
			<Badge variant="primary" pill>Pill Badge</Badge>
			<Badge variant="secondary" pill>Pill</Badge>
			<Badge variant="success" pill small>Small Pill</Badge>
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Badge } from '$lib';
</script>

<Badge variant="primary" pill>Pill Badge</Badge>
<Badge variant="secondary" pill>Pill</Badge>
<Badge variant="success" pill small>Small Pill</Badge>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Custom Styling"
	description="You can customize badges with additional class names or inline styles."
>
	{#snippet preview()}
		<div style="display: flex; gap: 0.5rem; align-items: center;">
			<Badge variant="primary" style="background-color: purple;">Custom Style</Badge>
			<Badge variant="secondary" class="custom-class">Custom Class</Badge>
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Badge } from '$lib';
</script>

<Badge variant="primary" style="background-color: purple;">Custom Style</Badge>
<Badge variant="secondary" class="custom-class">Custom Class</Badge>

<style>
  :global(.custom-class) {
    border: 2px dashed black;
  }
</style>`}
		/>
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Custom Rendering"
	description="For specialized use cases, badges can be customized with the custom prop to render as different elements."
>
	{#snippet preview()}
		<div style="display: flex; gap: 0.5rem; flex-direction: column; align-items: flex-start;">
			<Badge variant="primary" custom={customBadgeRenderer} />
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock
			code={`<script>
  import { Badge } from '$lib';
  
  // Simple function to use for the custom badge example
  function customBadgeRenderer({className}) {
    return \`<a href="#badge-docs" class="\${className}">Link Badge</a>\`;
  }
</script>

<Badge variant="primary" custom={customBadgeRenderer} />`}
		/>
	{/snippet}
</ComponentSandbox>

<h3>Badge API</h3>

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
			<td>BadgeVariantType</td>
			<td>undefined</td>
			<td>The visual style of the badge. Options include: {BADGE_VARIANTS.join(', ')}</td>
		</tr>
		<tr>
			<td>small</td>
			<td>boolean</td>
			<td>false</td>
			<td>Renders the badge in a smaller size</td>
		</tr>
		<tr>
			<td>pill</td>
			<td>boolean</td>
			<td>false</td>
			<td>Renders the badge with rounded pill corners</td>
		</tr>
		<tr>
			<td>style</td>
			<td>string</td>
			<td>undefined</td>
			<td>Custom inline styles for the badge</td>
		</tr>
		<tr>
			<td>class</td>
			<td>string</td>
			<td>undefined</td>
			<td>Additional custom class names to apply</td>
		</tr>
		<tr>
			<td>children</td>
			<td>Snippet</td>
			<td>undefined</td>
			<td>Content to display inside the badge</td>
		</tr>
		<tr>
			<td>custom</td>
			<td>Function</td>
			<td>undefined</td>
			<td>Custom rendering function to override badge element</td>
		</tr>
	</tbody>
</table>

<style lang="scss">
	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	th, td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--sg-sys-border-color);
	}

	th {
		background-color: var(--sg-sys-background-light);
		font-weight: 600;
	}
	
	:global(.custom-class) {
		border: 2px dashed black;
	}
</style>
<script lang="ts">
	import { Icon, Button } from '@sourcegraph/ui';
	import CodeBlock from '$layouts/CodeBlock.svelte'
	import ComponentSandbox from '$layouts/ComponentSandbox.svelte';
</script>

<h2>Button</h2>

<p>
	The Button component provides different variations to render a clickable UI elements, it also
	handles some corner cases for disabled state and ensures a proper ARIA-roles. And adds ripple
	UI effect for a visual feedback of the clicked state.
</p>

<ComponentSandbox
	title="Buttons with icons"
	description="Basic usage of the Button component with a Lucide icon."
>
	{#snippet preview()}
		<Button variant="primary">
			Get Started
			<Icon icon={ILucideArrowRight} inline/>
		</Button>

		<Button variant="secondary">
			Get Started
			<Icon icon={ILucideArrowRight} inline/>
		</Button>

		<Button variant="text">
			Get Started
			<Icon icon={ILucideArrowRight} inline/>
		</Button>
	{/snippet}
	{#snippet code()}
		<CodeBlock code={`
<script>
	import { Button } from 'sourcegraph-ui';
<\/script>

<Button variant="primary">
	Get Started
	<Icon icon={ILucideArrowRight} inline />
</Button>`.trim()} />
	{/snippet}
</ComponentSandbox>

<p>
	Notice that button itself overrides icon color, so icon within button changes
	its color depends on button variation.
</p>

<ComponentSandbox title="Button with different sizes" description="Button component can be rendered with different sizes (see size prop).">
	{#snippet preview()}
		<div class="button-sizes">
			<div class="row">
				<Button variant="primary" size="small">
					Get Started
					<Icon icon={ILucideArrowRight} inline/>
				</Button>

				<Button variant="secondary" size="small">
					Get Started
					<Icon icon={ILucideArrowRight} inline/>
				</Button>

				<Button variant="text" size="small">
					Get Started
					<Icon icon={ILucideArrowRight} inline/>
				</Button>
			</div>

			<div class="row">
				<Button variant="primary" size="large">
					Get Started
					<Icon icon={ILucideArrowRight} inline/>
				</Button>

				<Button variant="secondary" size="large">
					Get Started
					<Icon icon={ILucideArrowRight} inline/>
				</Button>

				<Button variant="text" size="large">
					Get Started
					<Icon icon={ILucideArrowRight} inline/>
				</Button>
			</div>
		</div>
	{/snippet}
	{#snippet code()}
		<CodeBlock code={`
<script>
	import { Button } from 'sourcegraph-ui';
<\/script>

<Button variant="primary" size="small">Get Started</Button>
<Button variant="secondary" size="large">Get Started</Button>
`.trim()} />
	{/snippet}
</ComponentSandbox>

<ComponentSandbox
	title="Disabled button"
	description="Button can be disabled, we use special aria-disabled to keep button focusable."
>
	{#snippet preview()}
		<Button variant="primary" disabled>
			Get Started
			<Icon icon={ILucideArrowRight} inline/>
		</Button>

		<Button variant="secondary" disabled>
			Get Started
			<Icon icon={ILucideArrowRight} inline/>
		</Button>

		<Button variant="text" disabled>
			Get Started
			<Icon icon={ILucideArrowRight} inline/>
		</Button>
	{/snippet}
	{#snippet code()}
		<CodeBlock code={`
<script>
	import { Button } from 'sourcegraph-ui';
<\/script>

<Button variant="text">Get Started</Button>`.trim()} />
	{/snippet}
</ComponentSandbox>

<p>
	By default, disabled button loses all interactivity. This means that you no longer
	can focus it and all events will go through the button element as it had pointer-events:none.
	This behavior breaks the tooltip logic (the standard case when you show tooltip with reason
	why this button is disabled). So to keep this case alive we have our own custom disabled
	state so the button is still focusable.
</p>

<style lang="scss">
	.button-sizes {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.row {
		display: flex;
		gap: 0.5rem;
	}
</style>

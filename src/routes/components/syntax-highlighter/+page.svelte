<script lang="ts">
	import ComponentSandbox from '$lib/layouts/ComponentSandbox.svelte';
	import SyntaxHighlighter from '$lib/components/SyntaxHighlighter.svelte';

	// Example code snippets for different languages
	const javaScriptCode = `function greet(name) {
  // Say hello to the user
  return 'Hello, ' + name + '!';
}

console.log(greet('World')); // Outputs: Hello, World!`;

	const typescriptCode = `interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];
  
  constructor() {
    this.users = [];
  }
  
  getUser(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
  
  addUser(user: User): void {
    this.users.push(user);
  }
}`;

	const svelteCode = `<script lang="ts">
  // Import component
  import Button from '$lib/components/Button.svelte';
  
  // Component props
  export let title = 'Hello World';
  export let count = 0;
  
  function handleClick() {
    count += 1;
  }
</script>

<h1>{title}</h1>
<p>Count: {count}</p>
<Button on:click={handleClick}>Increment</Button>

<style>
  h1 {
    color: blue;
  }
</style>`;

	const cssCode = `:root {
  --primary-color: #0366d6;
  --background: #ffffff;
  --text-color: #24292e;
}

body {
  font-family: system-ui, sans-serif;
  background-color: var(--background);
  color: var(--text-color);
  line-height: 1.5;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}`;

	const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Hello, World!</h1>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <p>Welcome to my website!</p>
  </main>
  
  <script src="script.js"></script>
</body>
</html>`;

	const jsonCode = `{
  "name": "sourcegraph-ui",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "lint": "prettier --plugin-search-dir . --check .",
    "format": "prettier --plugin-search-dir . --write ."
  }
}`;
</script>

<h1>Syntax Highlighter</h1>

<p>
	A component for highlighting source code with syntax highlighting using PrismJS. Supports multiple
	languages and optional line numbers.
</p>

<ComponentSandbox title="Basic Usage" code={`<script>
  import SyntaxHighlighter from '$lib/components/SyntaxHighlighter.svelte';
  
  const code = 'function greet() { return "Hello, world!"; }';
</script>

<SyntaxHighlighter code={code} language="javascript" />`}>
	<SyntaxHighlighter code="function greet() { return \"Hello, world!\"; }" language="javascript" />
</ComponentSandbox>

<ComponentSandbox
	title="With Line Numbers"
	code={`<script>
  import SyntaxHighlighter from '$lib/components/SyntaxHighlighter.svelte';
  
  const code = 'function greet() {\n  return "Hello, world!";\n}';
</script>

<SyntaxHighlighter code={code} language="javascript" showLineNumbers={true} />`}
>
	<SyntaxHighlighter
		code="function greet() {\n  return \"Hello, world!\";\n}"
		language="javascript"
		showLineNumbers={true}
	/>
</ComponentSandbox>

<h2>Language Examples</h2>

<h3>JavaScript</h3>
<SyntaxHighlighter code={javaScriptCode} language="javascript" showLineNumbers={true} />

<h3>TypeScript</h3>
<SyntaxHighlighter code={typescriptCode} language="typescript" showLineNumbers={true} />

<h3>Svelte</h3>
<SyntaxHighlighter code={svelteCode} language="svelte" showLineNumbers={true} />

<h3>CSS</h3>
<SyntaxHighlighter code={cssCode} language="css" showLineNumbers={true} />

<h3>HTML</h3>
<SyntaxHighlighter code={htmlCode} language="html" showLineNumbers={true} />

<h3>JSON</h3>
<SyntaxHighlighter code={jsonCode} language="json" showLineNumbers={true} />

<style>
	h1 {
		margin-bottom: 0.5rem;
	}

	p {
		margin-bottom: 2rem;
	}

	h2 {
		margin: 2rem 0 1rem;
	}

	h3 {
		margin: 1.5rem 0 0.5rem;
	}
</style>
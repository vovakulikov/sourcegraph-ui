<!--
  @component
  A component for highlighting source code using PrismJS.
  It takes a string of code and the language to highlight.
-->
<script lang="ts">
	// We'll use browser's Prism if available or it needs to be loaded
	import { onMount } from 'svelte';
	import '../layouts/prism-syntax.css';

	interface Props {
		code: string
		language: string
		showLineNumbers?: false
	}

	let { code, language, showLineNumbers }: Props = $props()

	// Generate a unique ID for this code block
	const id = `code-${Math.random().toString(36).substring(2, 9)}`;
	let highlighted = false;
	let codeElement: HTMLElement;

	// Language normalization mapping
	const languageAliases: Record<string, string> = {
		js: 'javascript',
		ts: 'typescript',
		css: 'css',
		html: 'html',
		svelte: 'svelte',
		json: 'json',
		bash: 'bash',
		sh: 'bash',
		shell: 'bash',
		scss: 'scss',
		sass: 'scss',
		md: 'markdown',
		markdown: 'markdown',
		tsx: 'tsx',
		jsx: 'jsx',
		yaml: 'yaml',
		py: 'python',
		python: 'python',
		go: 'go',
		rb: 'ruby',
		ruby: 'ruby',
		rs: 'rust',
		rust: 'rust',
		c: 'c',
		cpp: 'cpp',
		cs: 'csharp',
		csharp: 'csharp',
		java: 'java',
		php: 'php',
		dart: 'dart'
	};

	// Get normalized language
	function getNormalizedLanguage(lang: string): string {
		return languageAliases[lang.toLowerCase()] || lang.toLowerCase();
	}

	// Sanitize HTML to prevent XSS
	function sanitizeHTML(html: string): string {
		const element = document.createElement('div');
		element.textContent = html;
		return element.innerHTML;
	}

	// Handle highlighting
	function highlightCode() {
		if (!code || highlighted || !codeElement) return;

		// Ensure Prism is available (it should be loaded via MDXLayout)
		if (typeof window !== 'undefined' && window.Prism) {
			const normalizedLanguage = getNormalizedLanguage(language);
			const sanitizedCode = sanitizeHTML(code);
			
			// Add language class to pre element
			codeElement.parentElement?.classList.add(`language-${normalizedLanguage}`);
			
			// Let Prism handle the highlighting if available
			window.Prism.highlightElement(codeElement);
			highlighted = true;
		} else {
			// Fallback if Prism is not available - still show formatted code
			codeElement.textContent = code;
		}
	}

	// Setup in onMount
	onMount(() => {
		// Create script to load Prism if not already available
		if (typeof window !== 'undefined' && !window.Prism) {
			const script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
			script.async = true;
			script.onload = () => {
				// Load language support if needed
				const normalizedLanguage = getNormalizedLanguage(language);
				if (
					normalizedLanguage !== 'javascript' && // Included in core
					normalizedLanguage !== 'css' && // Included in core
					normalizedLanguage !== 'html' // Included in core
				) {
					const languageScript = document.createElement('script');
					languageScript.src = `https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${normalizedLanguage}.min.js`;
					languageScript.async = true;
					languageScript.onload = highlightCode;
					document.head.appendChild(languageScript);
				} else {
					highlightCode();
				}
			};
			document.head.appendChild(script);
		} else {
			// Prism already available, highlight right away
			highlightCode();
		}
	});

	// When code or language changes, re-highlight
	$effect(() => {
		if (code && codeElement) {
			highlighted = false;
			highlightCode();
		}
	});
</script>

<pre class:line-numbers={showLineNumbers} data-language={language}>
	<code id={id} class={`language-${getNormalizedLanguage(language)}`} bind:this={codeElement}>
		{code}
	</code>
</pre>

<style lang="scss">
	pre {
		margin: 0;
		overflow: auto;
		padding: 1rem;
		background-color: var(--sg-sys-background-light, #f8f9fa);
		border-radius: 6px;
		border: 1px solid var(--sg-sys-border, #e1e4e8);
		font-family: var(--sg-sys-font-family-code, monospace);
		font-size: 14px;
		line-height: 1.5;
		position: relative;
		tab-size: 2;
	}

	code {
		display: block;
		background: none;
		white-space: pre;
		word-spacing: normal;
		word-break: normal;
		word-wrap: normal;
		text-align: left;
		hyphens: none;
	}

	/* Line numbers styling */
	:global(.line-numbers) {
		padding-left: 3rem;
		counter-reset: linenumber;
	}

	:global(.line-numbers > code) {
		position: relative;
	}

	:global(.line-numbers .line-numbers-rows) {
		position: absolute;
		pointer-events: none;
		top: 0;
		font-size: 100%;
		left: -3.8rem;
		width: 3rem;
		letter-spacing: -1px;
		border-right: 1px solid #ddd;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	:global(.line-numbers-rows > span) {
		display: block;
		counter-increment: linenumber;
	}

	:global(.line-numbers-rows > span:before) {
		content: counter(linenumber);
		color: #999;
		display: block;
		padding-right: 0.8rem;
		text-align: right;
	}
</style>

<svelte:head>
	{#if showLineNumbers}
		<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.js">
		</script>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.css">
	{/if}
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import { basicSetup } from 'codemirror';
	import { EditorView, keymap } from '@codemirror/view';
	import { EditorState } from '@codemirror/state';
	import { javascript } from '@codemirror/lang-javascript';
	import { html } from '@codemirror/lang-html';

	let editorContainer: HTMLElement;
	let previewFrame: HTMLIFrameElement;
	let editor: EditorView;
	let isLoading = false;
	let compileTimeout: ReturnType<typeof setTimeout>;
	const DEBOUNCE_DELAY = 500; // 500ms debounce delay
	let initialCode = `<\script>
  // Svelte 5 syntax with runes for reactive state management
  let count = $state(0);
  import { SourcegraphLogo } from 'sourcegraph-ui'
  
  function increment() {
    count += 1;
  }
</\script>

<h3>Svelte 5 Counter Example</h3>
<SourcegraphLogo />

<div class="counter-container">
  <p>Current count: <span class="count">{count}</span></p>
  <button on:click={increment}>Increment</button>
</div>

<\style>
  h3 {
    color: #333;
    font-family: sans-serif;
    margin-bottom: 1rem;
  }
  
  .counter-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    background-color: #f9fafb;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .count {
    font-size: 1.5rem;
    font-weight: bold;
    color: #3b82f6;
  }
  
  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  button:hover {
    background-color: #2563eb;
  }
  
  button:active {
    transform: translateY(1px);
  }
</\style>
`;

	// Create an instance of the web worker
	let compilationWorker: Worker;
	// Map to track pending compilation requests
	let compilationRequests = new Map();
	// Counter for unique request IDs
	let requestCounter = 0;
	let componentStyles = ''; // Store compiled component styles
	let lastCompiledCode = ''; // Store the last successfully compiled code

	function debouncedCompile(code: string) {
		// Clear any existing timeout
		if (compileTimeout) {
			clearTimeout(compileTimeout);
		}
		
		// Set a new timeout
		compileTimeout = setTimeout(() => {
			compileAndRun(code);
		}, DEBOUNCE_DELAY);
	}

	async function compileAndRun(code: string) {
		isLoading = true;
		
		try {
			// Generate a unique ID for this compilation request
			const requestId = `req_${requestCounter++}`;
			
			// Create a promise that will be resolved when the worker responds
			const compilationPromise = new Promise((resolve, reject) => {
				compilationRequests.set(requestId, { resolve, reject });
			});
			
			// Send the code to the worker
			compilationWorker.postMessage({ code, id: requestId });
			
			// Wait for the worker to respond
			const result = await compilationPromise as { code: string; styles: string; error: string | null };
			
			// Handle the result
			if (result.error) {
				updatePreview(result.error, true);
			} else {
				componentStyles = result.styles || '';
				lastCompiledCode = result.code; // Store the successful compilation
				updatePreview(result.code);
			}
		} catch (error: unknown) {
			console.error('Compilation error:', error);
			let errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
			updatePreview(errorMessage, true);
		} finally {
			isLoading = false;
		}
	}

	function resetPreview() {
		// If we have previously compiled code, just reload the iframe
		if (lastCompiledCode) {
			updatePreview(lastCompiledCode);
		}
	}

	function updatePreview(code: string, isError = false) {
		// Reset iframe content
		const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow?.document;
		if (!frameDoc) return;

		frameDoc.open();
		frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 0; 
              padding: 1rem; 
              color: #333; 
              line-height: 1.5;
            }
            .error { 
              color: #b91c1c; 
              padding: 1rem; 
              border: 1px solid #fee2e2; 
              background: #fef2f2; 
              border-radius: 6px; 
              white-space: pre-wrap; 
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; 
              font-size: 0.9rem;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            }
          </style>
          ${componentStyles ? `<style>${componentStyles}</style>` : ''}
        </head>
        <body>
          ${isError ? `<div class="error">${code}</div>` : `<script>${code}<\/script>`}
        </body>
      </html>
    `);
		frameDoc.close();
	}

	onMount(() => {
		// Initialize the web worker
		compilationWorker = new Worker(
			new URL('../../lib/playground-worker.ts', import.meta.url),
			{ type: 'module' }
		);
		
		// Set up the event listener for worker messages
		compilationWorker.addEventListener('message', (event) => {
			const { id, code, styles, error } = event.data;
			
			// Find the pending request
			const request = compilationRequests.get(id);
			if (request) {
				compilationRequests.delete(id);
				if (error) {
					request.reject(new Error(error));
				} else {
					request.resolve({ code, styles, error });
				}
			}
		});

		// Initialize CodeMirror with better support for Svelte
		editor = new EditorView({
			state: EditorState.create({
				doc: initialCode,
				extensions: [
					basicSetup,
					// Use both HTML and JavaScript modes for better Svelte syntax highlighting
					html(),
					javascript(),
					EditorView.updateListener.of(update => {
						if (update.docChanged) {
							debouncedCompile(update.state.doc.toString());
						}
					})
				]
			}),
			parent: editorContainer
		});

		// Initial compilation - use direct call to avoid debounce delay
		compileAndRun(initialCode);

		return () => {
			// Clean up when component is destroyed
			editor.destroy();
			compilationWorker.terminate();
		};
	});
</script>

<div class="playground">
	<div class="playground-container">
		<div class="editor-container" bind:this={editorContainer}>
			<div class="editor-header">
				<span>Editor</span>
				<span></span> <!-- Empty span to maintain consistent layout -->
			</div>
		</div>
		<div class="preview-container">
			<div class="preview-header">
				<span>Preview</span>
				<button class="reset-btn" on:click={resetPreview}>Reset</button>
			</div>
			{#if isLoading}
				<div class="loading">
					<div class="spinner"></div>
					Compiling...
				</div>
			{/if}
			<iframe title="Preview" bind:this={previewFrame} sandbox="allow-scripts allow-same-origin"></iframe>
		</div>
	</div>
</div>

<style lang="scss">
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		color: #333;
		background-color: #f9fafb;
		overflow: hidden; /* Prevent scrolling on body */
	}

	.playground {
		width: 100%;
		margin: 0;
		padding: 0;
		overflow: hidden; /* Prevent scrolling */
	}



	.playground-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		height: 100vh;
		background-color: #fff;
		overflow: hidden;
		box-shadow: none;
		margin: 0;
	}

	.editor-container, .preview-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		position: relative;
	}

	.editor-container {
		border-right: 1px solid #e5e7eb;
	}

	.editor-header, .preview-header {
		padding: 0;
		font-size: 0.875rem;
		color: #4b5563;
		border-bottom: 1px solid #e5e7eb;
		background-color: #f3f4f6;
		display: flex;
		justify-content: space-between;
		align-items: stretch;
		height: 45px; /* Increased fixed height */
		box-sizing: border-box;
		overflow: hidden; /* Prevent content overflow */
		position: relative;
	}

	.editor-header span:first-child, .preview-header span:first-child {
		padding: 0 1rem;
		display: flex;
		align-items: center;
		height: 100%;
		font-weight: 600;
		line-height: 45px;
	}

	.reset-btn {
		font-size: 0.75rem;
		padding: 0 1rem;
		background-color: #e5e7eb;
		border: none;
		border-left: 1px solid #d1d5db;
		color: #4b5563;
		cursor: pointer;
		transition: background-color 0.2s;
		height: 100%;
		display: flex;
		align-items: center;
		line-height: 45px;
	}

	.reset-btn:hover {
		background-color: #d1d5db;
	}

	:global(.cm-editor) {
		height: 100%;
		overflow: auto;
	}

	:global(.cm-scroller) {
		font-family: 'Fira Code', monospace;
	}

	iframe {
		flex: 1;
		width: 100%;
		height: 100%;
		border: none;
		background-color: white;
	}

	.loading {
		position: absolute;
		top: 10px;
		right: 10px;
		display: flex;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 4px;
		padding: 6px 10px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		z-index: 10;
		font-size: 0.75rem;
		font-weight: 500;
		color: #4b5563;
		gap: 0.5rem;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid #e5e7eb;
		border-top-color: #3b82f6;
		border-radius: 50%;
		animation: spinner 0.8s linear infinite;
	}

	@keyframes spinner {
		to {
			transform: rotate(360deg);
		}
	}

	/* Media query for larger screens */
	@media (min-width: 1280px) {
		.playground-container {
			margin: 0;
			height: 100vh;
		}
	}

	/* Media query for smaller screens */
	@media (max-width: 768px) {
		.playground-container {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr;
		}

		.editor-container {
			border-right: none;
			border-bottom: 1px solid #e5e7eb;
		}
	}
</style>
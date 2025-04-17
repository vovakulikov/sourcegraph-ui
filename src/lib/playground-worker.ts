// Web worker for handling Svelte compilation and bundling
import { rollup } from '@rollup/browser';
import { componentRegistry } from 'virtual:component-registry';
import {
  emptyStylePlugin,
  componentDebugPlugin,
  catchAllResolverPlugin,
  sveltePlugin,
  unpkgResolverPlugin,
  unifiedVirtualFilePlugin,
  resetComponentStyles,
  getComponentStyles,
  preprocessSvelteComponent,
  formatCompilationError,
  type ComponentRegistry
} from './playground/index';

// Explicitly cast to our local type definition
const registry = componentRegistry as unknown as ComponentRegistry;

interface CompilationResult {
  code: string | null;
  styles: string | null;
  error: string | null;
}

async function compileCode(code: string): Promise<CompilationResult> {
  // Reset component styles for each compilation
  resetComponentStyles();
  
  try {
    // Determine if the code is a Svelte component
    const isSvelteComponent = code.trim().startsWith('<');
    
    // Create a temporary registry that extends the main registry
    const tempRegistry = { filesByPath: { ...registry.filesByPath } };
    
    // We'll use a virtual namespace for our runtime files to avoid collisions
    
    if (isSvelteComponent) {
      // Preprocess the component code before compiling
      const componentCode = await preprocessSvelteComponent(code);
      
      // Add component file to registry with normal path
      tempRegistry.filesByPath['component.svelte'] = {
        name: 'component',
        fullPath: 'component.svelte',
        source: componentCode,
        extension: '.svelte',
        isComponent: true,
        isBinary: false,
        directory: ''
      };
      
      // Add entry file to registry
      const entryCode = `
        import Component from './component.svelte';
        import { mount } from 'svelte';
        
        // Mount the component using Svelte 5's mount API
        const app = mount(Component, {
          target: document.body
        });
        
        export default app;
      `;
      
      tempRegistry.filesByPath['entry.js'] = {
        name: 'entry',
        fullPath: 'entry.js',
        source: entryCode,
        extension: '.js',
        isComponent: false,
        isBinary: false,
        directory: ''
      };
    } else {
      // Plain JavaScript code - add directly as entry
      tempRegistry.filesByPath['entry.js'] = {
        name: 'entry',
        fullPath: 'entry.js',
        source: code,
        extension: '.js',
        isComponent: false,
        isBinary: false,
        directory: ''
      };
    }
    
    // Rollup config with plugins
    const bundle = await rollup({
      input: 'virtual:file/entry.js', // Pass the virtual path directly as input
      plugins: [
        // Use plugin functions from separated modules
        emptyStylePlugin(),
        unifiedVirtualFilePlugin(tempRegistry),
        sveltePlugin(),
        componentDebugPlugin(),
        unpkgResolverPlugin(tempRegistry.filesByPath['entry.js'].source),
        catchAllResolverPlugin()
      ]
    });

    const { output } = await bundle.generate({
      format: 'iife',
      name: 'playground'
    });

    const bundledCode = output[0].code;
    return { 
      code: bundledCode, 
      styles: getComponentStyles(), 
      error: null 
    };
  } catch (error: unknown) {
    console.error('Bundling error:', error);
    const errorMessage = formatCompilationError(error);
    console.error('Formatted error:', errorMessage);
    
    return { code: null, styles: null, error: errorMessage };
  }
}

// Flag to indicate when the registry should be considered stale
let componentRegistryStale = false;

// Function to mark the registry as refreshed
function markRegistryRefreshed() {
  componentRegistryStale = false;
  return true;
}

// Set up event listener for messages from the main thread
self.addEventListener('message', async (event) => {
  const { code, id, type, timestamp } = event.data;
  
  // Handle refresh registry command - mark registry as stale
  if (type === 'refresh-registry') {
    componentRegistryStale = true;
    self.postMessage({ id, type: 'registry-refreshed', success: true });
    return;
  }
  
  // Handle registry updates from the component registry plugin
  if (type === 'registry-updated') {
    componentRegistryStale = false;
    return;
  }
  
  if (!code) {
    self.postMessage({ id, error: 'No code provided' });
    return;
  }
  
  try {
    const result = await compileCode(code);
    
    // Mark registry as refreshed after successful compilation
    if (componentRegistryStale) {
      markRegistryRefreshed();
    }
    
    self.postMessage({ id, ...result });
  } catch (error: unknown) {
    const errorMessage = formatCompilationError(error);
    self.postMessage({ 
      id, 
      error: `Worker error: ${errorMessage}` 
    });
  }
});
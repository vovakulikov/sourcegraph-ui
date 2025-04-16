// Web worker for handling Svelte compilation and bundling
import * as svelte from 'svelte/compiler';
import type { PreprocessorGroup, Processed } from 'svelte/compiler';
import { rollup } from '@rollup/browser';
import { componentRegistry } from 'virtual:component-registry';
// Explicitly cast to our local type definition
const registry = componentRegistry as unknown as ComponentRegistry;
import * as sass from 'sass';

// Define types to match the updated component registry
interface FileEntry {
  name: string;         // File name without extension
  fullPath: string;     // Full path relative to src/lib
  source: string;       // File content
  extension: string;    // File extension (e.g., '.svelte', '.js', '.ts')
  isComponent: boolean; // Whether this is a Svelte component
  isBinary: boolean;    // Whether this is a binary file (like SVG)
  directory: string;    // Directory path relative to src/lib
}

interface ComponentRegistry {
  components: Record<string, FileEntry>;
  filesByPath: Record<string, FileEntry>;
}

// Using Svelte's built-in preprocessors for SCSS handling

// Create persistent caches for module content, package entry points, and URL redirects
const moduleCache = new Map<string, string>();
const packageEntryCache = new Map<string, string>();
const moduleRedirectMap = new Map<string, string>(); // Track final URLs after redirects
let componentStyles = ''; // Store extracted CSS from Svelte components

// Use Svelte's built-in preprocessor functionality with sass compiler

// Function to compile SCSS to CSS using sass package
async function compileSass(scss: string): Promise<string> {
  try {
    const result = sass.compileString(scss);
    return result.css;
  } catch (error) {
    console.error('SCSS compilation error:', error);
    throw error;
  }
}

// Create a Svelte preprocessor that compiles SCSS to CSS
const sveltePreprocessor: PreprocessorGroup = {
  style: async ({ content, attributes }) => {
    // For scss styles, compile to CSS
    if (attributes.lang === 'scss') {
      try {
        const css = await compileSass(content);
        return { code: css };
      } catch (error) {
        console.error('SCSS compilation error:', error);
        // Return the original content on error to allow compilation to continue
        return { code: content };
      }
    }
    // Return undefined for other style blocks to let Svelte handle them
  }
};

// Preprocess a Svelte component using Svelte's built-in preprocessor
async function preprocessSvelteComponent(code: string): Promise<string> {
  try {
    // Check if we need preprocessing (has style lang="scss")
    if (!code.includes('lang="scss"') && !code.includes("lang='scss'")) {
      return code;
    }
    
    const processed = await svelte.preprocess(code, [sveltePreprocessor], { filename: 'component.svelte' });
    return processed.code;
  } catch (error) {
    console.error('Error preprocessing Svelte component:', error);
    return code; // Return original on error
  }
}

// Svelte compiler plugin for Rollup
function sveltePlugin() {
  return {
    name: 'svelte',
    transform: async (code: string, id: string) => {
      if (!id.endsWith('.svelte')) return null;
      
      try {
        // Preprocess SCSS before compiling using Svelte's preprocess
        const preprocessedCode = await preprocessSvelteComponent(code);
        
        // Use Svelte 5's compiler API
        const result = await svelte.compile(preprocessedCode, {
          generate: 'client',
          name: `SvelteComponent${Math.floor(Math.random() * 10000)}`,
          css: "external" // Extract CSS separately instead of injecting it
        });
        
        // Store the CSS from this component
        if (result.css?.code) {
          componentStyles += result.css.code;
        }
        
        return {
          code: result.js.code,
          map: result.js.map
        };
      } catch (error: unknown) {
        console.error('Svelte compilation error:', error);
        throw error;
      }
    }
  };
}

// Unpkg resolver plugin for handling bare module imports
function unpkgResolverPlugin(sourceCode: string) {
  return {
    name: 'unpkg-resolver',
    
    resolveId: async function(importee: string, importer: string | undefined) {
      // Skip if importee is already a URL or entry point
      if (importee === 'entry' || importee.startsWith('http')) {
        return importee;
      }
      
      // Handle sourcegraph-ui module imports
      if (importee === 'sourcegraph-ui') {
        return 'virtual:file/sourcegraph-ui';
      }

      // Handle relative imports
      if (importee.startsWith('./') || importee.startsWith('../')) {
        if (!importer || importer === 'entry') return null;
        
        // If importer is an unpkg URL, resolve relative to it
        if (importer.startsWith('https://unpkg.com/')) {
          // Use the redirected URL if available for more accurate path resolution
          const finalImporterUrl = moduleRedirectMap.get(importer) || importer;
          
          // Make sure we have the proper directory base for resolution
          const importerDir = finalImporterUrl.endsWith('/') 
            ? finalImporterUrl 
            : `${finalImporterUrl.substring(0, finalImporterUrl.lastIndexOf('/') + 1)}`;
          
          // Now resolve the relative path against the directory
          const resolvedPath = new URL(importee, importerDir).href;
          return resolvedPath;
        }
        
        return null;
      }
      
      // Handle bare module imports (e.g., 'lodash-es')
      // Parse package name and version
      const [packageWithVersion, ...subpathParts] = importee.split('/');
      const subpath = subpathParts.join('/');
      const [packageName, version = 'latest'] = packageWithVersion.split('@').filter(Boolean);
      const baseUrl = `https://unpkg.com/${packageName}@${version}`;
      
      // Direct subpath resolution
      if (subpath) {
        return `${baseUrl}/${subpath}`;
      }
      
      // Entry point resolution via package.json
      try {
        const cacheKey = `${packageName}@${version}`;
        if (!packageEntryCache.has(cacheKey)) {
          const packageJsonUrl = `${baseUrl}/package.json`;
          const packageJsonContent = await fetch(packageJsonUrl).then(res => res.text());
          const packageJson = JSON.parse(packageJsonContent);
          
          // Determine entry point (browser → module → main)
          const entryPoint = packageJson.browser || packageJson.module || packageJson.main || 'index.js';
          packageEntryCache.set(cacheKey, entryPoint);
        }
        
        return `${baseUrl}/${packageEntryCache.get(cacheKey)}`;
      } catch (error: unknown) {
        console.error(`Error resolving package ${importee}:`, error);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to resolve package ${importee}: ${message}`);
      }
    },
    
    load: async function(id: string) {
      if (id === 'entry') return sourceCode;
      if (!id.startsWith('https://unpkg.com/')) return null;
      
      // Use cache if available
      if (moduleCache.has(id)) {
        return moduleCache.get(id);
      }
      
      try {
        const response = await fetch(id);
        
        // Store the final URL after redirects
        if (response.url !== id) {
          moduleRedirectMap.set(id, response.url);
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${id}: ${response.status} ${response.statusText}`);
        }
        
        const content = await response.text();
        moduleCache.set(id, content);
        return content;
      } catch (error: unknown) {
        console.error(`Error loading module ${id}:`, error);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to load module ${id}: ${message}`);
      }
    }
  };
}

interface CompilationResult {
  code: string | null;
  styles: string | null;
  error: string | null;
}

async function compileCode(code: string): Promise<CompilationResult> {
  // Reset component styles for each compilation
  componentStyles = '';
  try {
    // Determine if the code is a Svelte component
    const isSvelteComponent = code.trim().startsWith('<');
    
    let entryCode: string;
    let inputFiles: Record<string, string> = {};
    
    if (isSvelteComponent) {
      // Preprocess the component code before compiling
      const componentCode = await preprocessSvelteComponent(code);
      
      // Create a main component file and an entry file that imports and mounts it
      inputFiles['component.svelte'] = componentCode;
      entryCode = `
        import Component from './component.svelte';
        import { mount } from 'svelte';
        
        // Mount the component using Svelte 5's mount API
        const app = mount(Component, {
          target: document.body
        });
        
        export default app;
      `;
    } else {
      // Plain JavaScript code - use it directly
      entryCode = code;
    }
    
    // Rollup config with plugins
    const bundle = await rollup({
      input: 'entry',
      plugins: [
        // Empty style plugin to handle CSS/SCSS imports
        {
          name: 'empty-style-plugin',
          resolveId(id: string) {
            if (id.endsWith('.css') || id.endsWith('.scss')) {
              return `\0empty-style:${id}`;
            }
            return null;
          },
          load(id: string) {
            if (id.startsWith('\0empty-style:')) {
              const originalPath = id.replace('\0empty-style:', '');
              return 'export default {}; // Empty style module';
            }
            return null;
          }
        },
        // Virtual file system for our entry point and component
        {
          name: 'virtual-files',
          resolveId(id: string, importer?: string) {
            if (id === 'entry') return id;
            // Handle virtual files
            if (inputFiles[id] || (importer && id.startsWith('./') && inputFiles[id.slice(2)])) {
              return id;
            }
            return null;
          },
          load(id: string) {
            if (id === 'entry') return entryCode;
            if (inputFiles[id]) return inputFiles[id];
            if (id.startsWith('./') && inputFiles[id.slice(2)]) {
              return inputFiles[id.slice(2)];
            }
            return null;
          }
        },
        // Process Svelte components
        sveltePlugin(),
        // Debug info about components
        {
          name: 'component-debug',
          buildStart() {
            // No debugging logs
          }
        },
        
        // Unified virtual file handler for all files (components, SVGs, etc.)
        {
          name: 'virtual-file-handler',
          resolveId(id: string, importer?: string) {
            // Special case for sourcegraph-ui package import
            if (id === 'sourcegraph-ui') {
              return 'virtual:file/sourcegraph-ui';
            }
            
            // Handle all virtual:file references
            if (id.startsWith('virtual:file/')) {
              return id;
            }
            
            // Handle relative imports from any virtual file - Process this BEFORE general file handling
            if (importer && importer.startsWith('virtual:file/') && 
                (id.startsWith('./') || id.startsWith('../'))) {
                // If the importer is a virtual file but the original URL was from unpkg
                // (this can happen due to how we track redirects), don't handle it here
                const virtualPath = importer.replace('virtual:file/', '');
                if (virtualPath.startsWith('https://unpkg.com/')) {
                  return null;
                }
                
                // Extract path from importer
                const importerFilePath = importer?.replace('virtual:file/', '') || '';
                const importerPath = importerFilePath.split('/').slice(0, -1).join('/');
                
                // Now resolve the relative import against the importer's path
                let resolvedPath = '';
                if (id.startsWith('./')) {
                  // Same directory import
                  resolvedPath = `${importerPath}/${id.substring(2)}`;
                } else if (id.startsWith('../')) {
                  // Parent directory import
                  const parts = importerPath.split('/');
                  const parentPath = parts.slice(0, -1).join('/');
                  resolvedPath = `${parentPath}/${id.substring(3)}`;
                }
                
                // Normalize the path
                resolvedPath = resolvedPath.replace(/\\/g, '/').replace(/\/+/g, '/');
                
                // Create a virtual module for this file
                return `virtual:file/${resolvedPath}`;
            }
            
            // Check if this is coming from an unpkg URL, if so don't convert to virtual file
            if (importer && importer.startsWith('https://unpkg.com/')) {
                return null; // Let the unpkgResolverPlugin handle it
            }
                  
            // Handle any file import that isn't already virtual
            // This works for both SVGs and other file types
            if ((!id.startsWith('virtual:')) && (!id.startsWith('http')) && 
                (!id.startsWith('/')) && id.includes('.')) {
              // Skip style files if they're handled by empty-style-plugin
              if (id.endsWith('.css') || id.endsWith('.scss')) {
                return null;
              }
              
              // Remove leading './' if present for simpler path handling
              const cleanPath = id.startsWith('./') ? id.substring(2) : id;
              return `virtual:file/${cleanPath}`;
            }
            
            return null;
          },
          load(id: string) {
            // Special case for the main sourcegraph-ui module
            if (id === 'virtual:file/sourcegraph-ui') {
              const componentNames = Object.keys(registry.components);
              
              // Create a single module that exports all components
              // Each component is exported directly with its full path
              const exports = componentNames
                .map((name) => {
                  const component = registry.components[name];
                  return `export { default as ${name} } from 'virtual:file/${component.fullPath}';`;
                })
                .join('\n');
              
              return exports;
            }
            
            // Handle all virtual file loads
            if (id.startsWith('virtual:file/')) {
              const filePath = id.replace('virtual:file/', '');
              
              // Try to find the file by full path
              let file = registry.filesByPath[filePath];
              
              // If not found and it's a Svelte file, try component lookup for backward compatibility
              if (!file && filePath.endsWith('.svelte')) {
                // Try to extract component name from the path
                const pathParts = filePath.split('/');
                const fileName = pathParts[pathParts.length - 1];
                const componentName = fileName.replace('.svelte', '');
                
                // Look up in component registry
                file = registry.components[componentName];
              }
              
              // If still not found and path contains directories, try path without leading components
              if (!file && filePath.includes('/')) {
                // Try removing leading components
                const pathParts = filePath.split('/');
                // Try different path combinations, removing parts from the start
                for (let i = 1; i < pathParts.length; i++) {
                  const alternativePath = pathParts.slice(i).join('/');
                  file = registry.filesByPath[alternativePath];
                  if (file) {
                    break;
                  }
                }
              }
              
              if (file) {
                // Special handling for SVG files - convert to data URI
                if (file.extension === '.svg') {
                  const svgContent = file.source;
                  const encoded = encodeURIComponent(svgContent)
                    .replace(/'/g, '%27')
                    .replace(/"/g, '%22');
                  
                  const dataUri = `data:image/svg+xml;charset=utf-8,${encoded}`;
                  return `export default "${dataUri}";`;
                }
                
                // Return raw source for all other files
                return file.source;
              } else {
                console.error('  ❌ File not found in registry:', filePath);
                
                // Provide fallbacks based on file extension
                if (filePath.endsWith('.svg')) {
                  return `export default "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2010%2010%22%3E%3C%2Fsvg%3E";`;
                } else if (filePath.endsWith('.svelte')) {
                  return `<div>Component not found: ${filePath}</div>`;
                }
                
                return `/* File not found: ${filePath} */`;
              }
            }
            
            return null;
          }
        },

        // Handle module imports
        unpkgResolverPlugin(entryCode),

        // Catch-all plugin for unresolved imports
        {
          name: 'catch-all-resolver',
          // This plugin has the lowest priority
          resolveId(id, importer) {
            // Only handle imports that aren't handled by other plugins
            // This is a fallback to prevent errors for imports from components
            if (!id.startsWith('https://') && !id.startsWith('virtual:') && !id.startsWith('./') && !id.startsWith('../')) {
              return `\0empty:${id}`;
            }
            return null;
          },
          load(id) {
            // Return empty modules for our catch-all IDs
            if (id.startsWith('\0empty:')) {
              return 'export default {}; // Empty module';
            }
            return null;
          }
        }
      ]
    });

    const { output } = await bundle.generate({
      format: 'iife',
      name: 'playground'
    });

    const bundledCode = output[0].code;
    return { code: bundledCode, styles: componentStyles, error: null };
  } catch (error: unknown) {
    console.error('Bundling error:', error);
    let errorMessage: string;
    
    if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`;
      console.error('Full error message:', error.message);
      
      // Add stack trace info for better debugging
      if (error.stack) {
        const stackLines = error.stack.split('\n').slice(0, 5).join('\n');
        errorMessage += `\n\nStack trace:\n${stackLines}`;
        console.error('Error stack:', error.stack);
      }
      
      // If there's an information about svelte compilation errors
      if ('frame' in error && error.frame) {
        console.error('Error frame:', error.frame);
        errorMessage += `\n\nFrame: ${error.frame}`;
      }
    } else {
      errorMessage = `Error: ${String(error)}`;
      console.error('Full string error:', String(error));
    }
    
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
    const message = error instanceof Error ? error.message : String(error);
    self.postMessage({ 
      id, 
      error: `Worker error: ${message}` 
    });
  }
});
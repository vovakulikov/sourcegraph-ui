import * as svelte from 'svelte/compiler';
import type { PreprocessorGroup } from 'svelte/compiler';

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
export async function preprocessSvelteComponent(code: string): Promise<string> {
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

// Function to compile SCSS to CSS using sass package
async function compileSass(content: string): Promise<string> {
  try {
    // Import dynamically to avoid bundling issues
    const sass = await import('sass');
    const result = sass.compileString(content);
    return result.css;
  } catch (error) {
    console.error('SCSS compilation error:', error);
    throw error;
  }
}

// Track extracted CSS from Svelte components
let componentStyles = '';

// Reset component styles for each compilation
export function resetComponentStyles() {
  componentStyles = '';
}

// Get the current component styles
export function getComponentStyles(): string {
  return componentStyles;
}

/**
 * Svelte compiler plugin for Rollup
 * Handles compiling Svelte components including preprocessing SCSS styles
 */
export function sveltePlugin() {
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
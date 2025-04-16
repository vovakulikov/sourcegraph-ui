/**
 * SCSS preprocessor for Svelte components in the browser
 * Uses sass.js to compile SCSS to CSS
 */
import type { CompileOptions } from 'svelte/compiler';

declare global {
  interface Window {
    Sass: {
      compile(source: string, options: object, callback: (result: { text: string }) => void): void;
    };
  }
}

let sassInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize sass.js by loading it from CDN
 */
function initializeSass(): Promise<void> {
  if (sassInitialized) return Promise.resolve();
  if (initializationPromise) return initializationPromise;
  
  initializationPromise = new Promise<void>((resolve, reject) => {
    try {
      // Create script elements to load sass.js
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.11.1/sass.sync.min.js';
      script.onload = () => {
        console.log('Sass.js loaded successfully');
        sassInitialized = true;
        resolve();
      };
      script.onerror = (error) => {
        console.error('Failed to load Sass.js:', error);
        reject(new Error('Failed to load Sass.js'));
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error initializing Sass.js:', error);
      reject(error);
    }
  });
  
  return initializationPromise;
}

/**
 * Compile SCSS to CSS using sass.js
 */
function compileSass(scss: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (!window.Sass) {
        reject(new Error('Sass.js not initialized'));
        return;
      }
      
      window.Sass.compile(scss, {}, (result) => {
        if (result.text) {
          resolve(result.text);
        } else {
          reject(new Error('Sass compilation failed'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Processes a Svelte component to convert SCSS to CSS
 * This is used before passing the component to the Svelte compiler
 */
export async function processSvelteComponent(source: string): Promise<string> {
  try {
    // Simple regex to detect if the component has SCSS styles
    const hasScss = /<style\s+lang=["']scss["']>([\s\S]*?)<\/style>/i.test(source);
    
    if (!hasScss) {
      // No SCSS, return the original source
      return source;
    }
    
    // Initialize sass.js if needed
    await initializeSass();
    
    // Use regex to find and replace SCSS style blocks
    return source.replace(
      /<style\s+lang=["']scss["']>([\s\S]*?)<\/style>/gi,
      async (match, scssContent) => {
        try {
          // Compile SCSS to CSS
          const css = await compileSass(scssContent);
          return `<style>${css}</style>`;
        } catch (error) {
          console.error('SCSS compilation error:', error);
          // Return a commented error in the style block
          return `<style>/* SCSS Compilation Error: ${error instanceof Error ? error.message : String(error)} */</style>`;
        }
      }
    );
  } catch (error) {
    console.error('Error processing Svelte component:', error);
    return source; // Return original source on error
  }
}

/**
 * Create a Svelte preprocessor for SCSS
 */
export function createScssPreproccesor(): CompileOptions['preprocess'] {
  return {
    style: async ({ content, attributes }) => {
      if (attributes.lang !== 'scss') {
        return { code: content };
      }
      
      try {
        // Initialize sass.js if needed
        await initializeSass();
        
        // Compile SCSS to CSS
        const css = await compileSass(content);
        return { code: css };
      } catch (error) {
        console.error('SCSS preprocessing error:', error);
        return { 
          code: `/* SCSS Compilation Error: ${error instanceof Error ? error.message : String(error)} */`,
          dependencies: []
        };
      }
    }
  };
}
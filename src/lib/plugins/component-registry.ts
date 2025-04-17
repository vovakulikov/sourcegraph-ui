import type { Plugin, ViteDevServer } from 'vite'
import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'

export interface FileEntry {
  name: string         // File name without extension
  fullPath: string     // Full path relative to src/lib
  source: string       // File content
  extension: string    // File extension (e.g., '.svelte', '.js', '.ts')
  isComponent: boolean // Whether this is a Svelte component
  isBinary: boolean    // Whether this is a binary file (like SVG)
  directory: string    // Directory path relative to src/lib
}

export interface ComponentRegistry {
  // Path-based registry for resolving all imports
  filesByPath: Record<string, FileEntry>
}

// Virtual module ID that will contain our component registry
const VIRTUAL_MODULE_ID = 'virtual:component-registry'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

/**
 * Vite plugin that scans the entire src/lib directory for all relevant files
 * and exposes them as a virtual module for use in the playground.
 * 
 * This includes Svelte components, JS/TS files, CSS/SCSS, and JSON files.
 * The registry maintains the original directory structure to properly
 * handle relative imports between files.
 */
export function componentRegistryPlugin(): Plugin {
  let registry: ComponentRegistry
  let libDir: string
  
  // Function to build the component registry
  function buildRegistry() {
    registry = { filesByPath: {} }
    
    try {
      // Function to recursively scan directories for all files in src/lib
      function scanDirectory(dir: string) {
        const files = fs.readdirSync(dir)
        
        for (const file of files) {
          const fullPath = path.resolve(dir, file)
          const stat = fs.statSync(fullPath)
          
          if (stat.isDirectory()) {
            // Ignore node_modules and hidden directories
            if (!file.startsWith('.') && file !== 'node_modules') {
              scanDirectory(fullPath)
            }
          } else {
            // Process file if it has a valid extension
            const validExtensions = ['.svelte', '.js', '.ts', '.json', '.css', '.scss', '.svg']
            const extension = path.extname(file)
            
            if (validExtensions.includes(extension)) {
              const name = path.basename(file, extension)
              const relativeToLib = path.relative(libDir, fullPath).replace(/\\/g, '/')
              const directory = path.dirname(relativeToLib)
              const isComponent = extension === '.svelte'
              const isBinary = extension === '.svg'
              
              // Read content appropriately based on file type
              let source: string
              if (isBinary) {
                // For SVG files, we still read as text since they are XML-based
                source = fs.readFileSync(fullPath, 'utf-8')
              } else {
                // For all other files, read as text
                source = fs.readFileSync(fullPath, 'utf-8')
              }
              
              const fileEntry: FileEntry = {
                name,
                fullPath: relativeToLib,
                source,
                extension,
                isComponent,
                isBinary,  // Mark SVG files as binary
                directory
              }
              
              // Store in path-based registry for all imports
              registry.filesByPath[relativeToLib] = fileEntry
            }
          }
        }
      }
      
      scanDirectory(libDir)
      console.log(`Component registry built with ${Object.keys(registry.filesByPath).length} total files`)
      
      // Log all SVG files specifically for debugging
      const svgFiles = Object.keys(registry.filesByPath).filter(path => path.endsWith('.svg'))
      console.log('SVG files registered:', svgFiles)
      
      console.log('All files registered by path:', Object.keys(registry.filesByPath).length)
    } catch (error) {
      console.error('Error building component registry:', error)
    }
  }
  
  return {
    name: 'component-registry',
    configResolved() {
      try {
        const __dirname = fileURLToPath(new URL('.', import.meta.url))
        libDir = path.resolve(__dirname, '..')
        
        // Initial build of the registry
        buildRegistry()
      } catch (error) {
        console.error('Error resolving lib directory:', error)
      }
    },
    
    
    configureServer(server: ViteDevServer) {
      // Set up file watchers for src/lib directory
      const watcher = server.watcher
      
      // Watch for all relevant file changes in the lib directory
      const validExtensions = ['.svelte', '.js', '.ts', '.json', '.css', '.scss', '.svg']
      validExtensions.forEach(ext => {
        watcher.add(path.join(libDir, `**/*${ext}`))
      })
      
      // When a file changes, rebuild the registry
      watcher.on('change', (filePath) => {
        if (filePath.startsWith(libDir) && validExtensions.some(ext => filePath.endsWith(ext))) {
          console.log(`File changed: ${filePath}, rebuilding registry...`)
          buildRegistry()
          
          // Notify clients about the change
          server.ws.send({
            type: 'full-reload',
            path: '*'
          })
        }
      })
      
      // When a file is added, rebuild the registry
      watcher.on('add', (filePath) => {
        if (filePath.startsWith(libDir) && validExtensions.some(ext => filePath.endsWith(ext))) {
          console.log(`File added: ${filePath}, rebuilding registry...`)
          buildRegistry()
          
          // Notify clients about the change
          server.ws.send({
            type: 'full-reload',
            path: '*'
          })
        }
      })
      
      // When a file is deleted, rebuild the registry
      watcher.on('unlink', (filePath) => {
        if (filePath.startsWith(libDir) && validExtensions.some(ext => filePath.endsWith(ext))) {
          console.log(`File deleted: ${filePath}, rebuilding registry...`)
          buildRegistry()
          
          // Notify clients about the change
          server.ws.send({
            type: 'full-reload',
            path: '*'
          })
        }
      })
    },
    
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },
    
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        // Include a timestamp in the exported code to prevent caching
        const timestamp = Date.now();
        const code = `
          // Generated at ${new Date().toISOString()}
          export const componentRegistry = ${JSON.stringify(registry)};
          export const timestamp = ${timestamp};
          
          // Notify the main thread of an update
          if (typeof self !== 'undefined' && 'postMessage' in self) {
            try {
              self.postMessage({ type: 'registry-updated', timestamp: ${timestamp} });
            } catch (e) {
              // Ignore errors when posting message
            }
          }
        `;
        return code
      }
    },
    
    // Make sure our module is never cached
    transformIndexHtml: {
      enforce: 'pre',
      transform() {
        // Force rebuild the registry on each page load to ensure latest components
        buildRegistry();
        return;
      }
    },
    
    handleHotUpdate({ file, server }) {
      // If any relevant file was changed, invalidate the module
      const validExtensions = ['.svelte', '.js', '.ts', '.json', '.css', '.scss', '.svg']
      
      if (file.startsWith(libDir) && validExtensions.some(ext => file.endsWith(ext))) {
        // Rebuild the registry
        buildRegistry()
        
        // Find the module to invalidate
        const module = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)
        if (module) {
          console.log('Invalidating component registry module')
          return [module]
        }
      }
      return []
    }
  }
}
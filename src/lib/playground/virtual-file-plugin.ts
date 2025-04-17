import type { Plugin } from '@rollup/browser';

// Define registry types
export interface FileEntry {
  name: string;         // File name without extension
  fullPath: string;     // Full path relative to src/lib
  source: string;       // File content
  extension: string;    // File extension (e.g., '.svelte', '.js', '.ts')
  isComponent: boolean; // Whether this is a Svelte component
  isBinary: boolean;    // Whether this is a binary file (like SVG)
  directory: string;    // Directory path relative to src/lib
}

export interface ComponentRegistry {
  filesByPath: Record<string, FileEntry>;
}

/**
 * Helper function to resolve virtual paths properly
 * Uses URL for standardized path resolution
 */
export function resolveVirtualPath(basePath: string, relativePath: string): string {
  // Create a proper URL object to handle path resolution
  try {
    // Base must be a URL so prepend with dummy protocol
    const url = new URL(relativePath, `https://example.org/${basePath}/`);
    // Return just the pathname part, without leading slash
    return url.pathname.substring(1);
  } catch (e) {
    console.error('Path resolution error:', e);
    return `${basePath}/${relativePath.replace(/^\.\//,'')}`;
  }
}

/**
 * Unified virtual file system plugin that handles all files through a single registry
 * Provides a virtual file system for accessing components, SVGs, input files, and other files
 */
export function unifiedVirtualFilePlugin(
  registry: ComponentRegistry
): Plugin {
  return {
    name: 'unified-virtual-file-system',
    
    // Add transform function to handle SVG conversion
    transform(code: string, id: string) {
      // Only handle SVG files - check both path and file extension from registry
      if (id.startsWith('virtual:file/')) {
        // Get the real path
        const realPath = id.replace('virtual:file/', '');
        const file = registry.filesByPath[realPath];
        
        // Handle both when path ends with .svg or when file has .svg extension
        if (id.endsWith('.svg') || (file && file.extension === '.svg')) {
          const svgContent = code;
          const encoded = encodeURIComponent(svgContent)
            .replace(/'/g, '%27')
            .replace(/"/g, '%22');
          
          const dataUri = `data:image/svg+xml;charset=utf-8,${encoded}`;
          return `export default "${dataUri}";`;
        }
      }
      
      // Otherwise return null to let other plugins process it
      return null;
    },
    resolveId(id: string, importer?: string) {
      // All virtual files are consistent with virtual:file/ prefix
      if (id.startsWith('virtual:file/')) {
        // Allow pass-through for already virtualized file paths
        return id;
      }
      
      // Handle sourcegraph-ui by mapping to components/index.ts
      if (id === 'sourcegraph-ui') return 'virtual:file/lib/components/index.ts';
      
      // Skip unpkg imports
      if (importer?.startsWith('https://unpkg.com/')) return null;
      
      // Handle relative imports from virtual files
      if (importer?.startsWith('virtual:file/') && 
          (id.startsWith('./') || id.startsWith('../'))) {
        const importerPath = importer.replace('virtual:file/', '');
        
        // Skip unpkg URLs
        if (importerPath.startsWith('https://unpkg.com/')) return null;
        
        // Extract directory path from importer
        const importerDir = importerPath.split('/').slice(0, -1).join('/');
        const resolvedPath = resolveVirtualPath(importerDir, id);
        
        return `virtual:file/${resolvedPath}`;
      }
      
      // 5. Convert regular file imports to virtual files
      if (!id.startsWith('virtual:') && !id.startsWith('http') && 
          !id.startsWith('/') && id.includes('.')) {
        
        // Skip style files
        if (id.endsWith('.css') || id.endsWith('.scss')) return null;
        
        const cleanPath = id.startsWith('./') ? id.substring(2) : id;
        return `virtual:file/${cleanPath}`;
      }
      
      return null;
    },
    load(id: string) {
      // Convert virtual paths to real paths for lookup
      if (id.startsWith('virtual:file/')) {
        const realPath = id.replace('virtual:file/', '');
        const file = registry.filesByPath[realPath];
        if (file) return file.source;
      }

      if (id === 'virtual:file/lib/components/index.ts') {
        return `export { default as Badge } from "./Badge.svelte"
        export { default as Button } from "./button/Button.svelte"
        `
      }
      
      // 3. Handle all virtual file loads from registry
      if (id.startsWith('virtual:file/')) {
        const filePath = id.replace('virtual:file/', '');
        
        // Try to find the file by full path
        let file = registry.filesByPath[filePath];
        
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
          // Return file source - SVG conversion now happens in transform
          return file.source;
        } else {
          console.error('  \u274c File not found in registry:', filePath);
          
          // Provide fallbacks based on file extension - SVG fallback now handled in transform
          if (filePath.endsWith('.svelte')) {
            return `<div>Component not found: ${filePath}</div>`;
          }
          
          // For SVGs, return empty SVG content to be transformed
          if (filePath.endsWith('.svg')) {
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>`;
          }
          
          return `/* File not found: ${filePath} */`;
        }
      }
      
      return null;
    }
  };
}
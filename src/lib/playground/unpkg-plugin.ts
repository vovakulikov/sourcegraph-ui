// Persistent caches for module content, package entry points, and URL redirects
const moduleCache = new Map<string, string>();
const packageEntryCache = new Map<string, string>();
const moduleRedirectMap = new Map<string, string>(); // Track final URLs after redirects

/**
 * Unpkg resolver plugin for handling bare module imports
 * Allows importing npm packages directly from unpkg.com
 */
export function unpkgResolverPlugin(sourceCode: string) {
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
      // Entry point is now handled by the virtual file plugin
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
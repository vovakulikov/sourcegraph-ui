/**
 * Catch-all plugin for unresolved imports
 * Prevents errors from unresolved imports by providing empty modules
 */
export function catchAllResolverPlugin() {
  return {
    name: 'catch-all-resolver',
    // This plugin has the lowest priority
    resolveId(id: string, importer?: string) {
      // Only handle imports that aren't handled by other plugins
      // This is a fallback to prevent errors for imports from components
      if (!id.startsWith('https://') && !id.startsWith('virtual:') && !id.startsWith('./') && !id.startsWith('../')) {
        return `\0empty:${id}`;
      }
      return null;
    },
    load(id: string) {
      // Return empty modules for our catch-all IDs
      if (id.startsWith('\0empty:')) {
        return 'export default {}; // Empty module';
      }
      return null;
    }
  };
}
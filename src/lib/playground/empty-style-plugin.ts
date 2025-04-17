/**
 * Empty style plugin to handle CSS/SCSS imports by replacing them with empty modules
 */
export function emptyStylePlugin() {
  return {
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
  };
}
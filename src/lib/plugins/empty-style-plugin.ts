import type { Plugin } from 'vite'

/**
 * Plugin options for empty-style-plugin
 */
export interface EmptyStylePluginOptions {
  /**
   * File extensions to handle (defaults to [".css", ".scss"])
   */
  extensions?: string[]

  /**
   * Custom content to return for style files
   * Defaults to 'export default {}; // Empty module'
   */
  content?: string
}

/**
 * Vite plugin that returns an empty module for style files.
 * 
 * This is useful in testing/playground environments where you want to
 * ignore style imports but still allow the module system to resolve them.
 * 
 * @example
 * // Basic usage with default settings
 * plugins: [
 *   emptyStylePlugin()
 * ]
 * 
 * @example
 * // Custom configuration
 * plugins: [
 *   emptyStylePlugin({
 *     extensions: [".css", ".scss", ".less"],
 *     content: 'export default { id: "virtual-style" };'
 *   })
 * ]
 */
export function emptyStylePlugin(options: EmptyStylePluginOptions = {}): Plugin {
  const extensions = options.extensions || [".css", ".scss"]
  const content = options.content || 'export default {}; // Empty style module'
  
  return {
    name: 'empty-style-plugin',
    
    resolveId(id: string) {
      if (extensions.some(ext => id.endsWith(ext))) {
        // Return a custom ID that we can recognize in the load hook
        return `\0virtual:empty-style:${id}`
      }
      return null
    },
    
    load(id: string) {
      if (id.startsWith('\0virtual:empty-style:')) {
        // Extract the original path for logging
        const originalPath = id.replace('\0virtual:empty-style:', '')
        console.log(`[empty-style-plugin] Providing empty module for style: ${originalPath}`)
        return content
      }
      return null
    }
  }
}
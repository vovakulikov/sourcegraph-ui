/**
 * Debug info about components - can be expanded later for more debugging capabilities
 */
export function componentDebugPlugin() {
  return {
    name: 'component-debug',
    buildStart() {
      // No debugging logs by default
    }
  };
}
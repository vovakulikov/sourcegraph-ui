/**
 * Helper function to trigger a refresh of the playground worker's component registry.
 * This is called when a component is modified.
 */
export async function refreshPlaygroundRegistry() {
  // Find all playground iframes
  const iframes = window.document.querySelectorAll('iframe.playground-preview');
  if (iframes.length === 0) return;
  
  console.log('Notifying playground of component registry update');
  
  // Notify each iframe
  Array.from(iframes).forEach(iframe => {
    try {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'refresh-registry' }, '*');
      }
    } catch (error) {
      console.error('Failed to notify playground:', error);
    }
  });
}

// Listen for Vite's hot update events to detect component changes
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', (payload: { updates: Array<{ path: string }> }) => {
    const isComponentUpdate = payload.updates.some(
      update => update.path.endsWith('.svelte') && update.path.includes('/components/')
    );
    
    if (isComponentUpdate) {
      console.log('Component update detected, notifying playground');
      refreshPlaygroundRegistry();
    }
  });
}
/**
 * Process compilation errors to provide better diagnostics
 * Formats error information consistently with stack traces and frames
 */
export function formatCompilationError(error: unknown): string {
  let errorMessage: string;
  
  if (error instanceof Error) {
    errorMessage = `Error: ${error.message}`;
    
    // Add stack trace info for better debugging
    if (error.stack) {
      const stackLines = error.stack.split('\n').slice(0, 5).join('\n');
      errorMessage += `\n\nStack trace:\n${stackLines}`;
    }
    
    // If there's information about svelte compilation errors
    if ('frame' in error && error.frame) {
      errorMessage += `\n\nFrame: ${error.frame}`;
    }
  } else {
    errorMessage = `Error: ${String(error)}`;
  }
  
  return errorMessage;
}
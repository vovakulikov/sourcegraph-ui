// Type definitions for Prism.js

declare global {
  interface Window {
    Prism: {
      highlightElement: (element: HTMLElement) => void;
      highlightAll: () => void;
      languages: Record<string, object>;
    };
  }
}

export {};
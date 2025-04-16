declare module 'virtual:component-registry' {
  export interface ComponentEntry {
    name: string;
    path: string;
    source: string;
  }

  export interface ComponentRegistry {
    components: Record<string, ComponentEntry>;
  }

  export const componentRegistry: ComponentRegistry;
}
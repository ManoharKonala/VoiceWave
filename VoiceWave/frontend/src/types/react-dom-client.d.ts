import { Root } from 'react-dom/client';

declare module 'react-dom/client' {
  export * from '@types/react-dom/client';
  
  interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
  }
  
  function createRoot(container: Element | DocumentFragment, options?: {
    identifierPrefix?: string;
    onRecoverableError?: (error: unknown) => void;
  }): Root;
  
  function hydrateRoot(container: Element | DocumentFragment, initialChildren: React.ReactNode, options?: {
    identifierPrefix?: string;
    onRecoverableError?: (error: unknown) => void;
  }): Root;
}

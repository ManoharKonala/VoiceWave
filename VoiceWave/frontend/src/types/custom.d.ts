// This file contains custom type declarations for your application

// Add type declarations for React
import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Add module declarations for CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Add module declarations for image files
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg' {
  const content: string;
  export default content;
}

// Add module declarations for audio files
declare module '*.mp3';
declare module '*.wav';
declare module '*.ogg';

// Add module declarations for React Toastify
declare module 'react-toastify' {
  import { ComponentType, ReactNode } from 'react';
  
  export interface ToastContainerProps {
    position?: string;
    autoClose?: number | false;
    hideProgressBar?: boolean;
    newestOnTop?: boolean;
    closeOnClick?: boolean;
    rtl?: boolean;
    pauseOnFocusLoss?: boolean;
    draggable?: boolean;
    pauseOnHover?: boolean;
  }
  
  export const ToastContainer: ComponentType<ToastContainerProps>;
  export function toast(content: ReactNode, options?: any): any;
}

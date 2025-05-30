import * as React from 'react';
import { Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      maxContentWidth: string;
    };
  }
  
  interface ThemeOptions {
    custom?: {
      maxContentWidth?: string;
    };
  }
  
  function createTheme(options?: ThemeOptions, ...args: object[]): Theme;
}

declare module '@mui/material/CssBaseline' {
  export interface CssBaselineProps {
    children?: React.ReactNode;
  }
  
  const CssBaseline: React.ComponentType<CssBaselineProps>;
  export default CssBaseline;
}

declare module '@mui/material/Button' {
  export interface ButtonPropsVariantOverrides {
    gradient: true;
  }
}

declare module '@mui/material/styles/components' {
  interface Components {
    MuiButton?: {
      variants?: Array<{
        props: { variant: string };
        style: React.CSSProperties;
      }>;
    };
  }
}

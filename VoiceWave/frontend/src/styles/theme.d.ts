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
}

declare const theme: Theme;

export default theme;

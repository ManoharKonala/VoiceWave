import { ReactNode, ReactElement } from 'react';

declare module 'react-router-dom' {
  import * as React from 'react';
  import * as H from 'history';

  export interface BrowserRouterProps {
    basename?: string;
    children?: React.ReactNode;
    window?: Window;
  }

  export const BrowserRouter: React.FC<BrowserRouterProps>;
  
  export interface RouteProps {
    path?: string;
    element?: React.ReactNode | ReactElement<any>;
    index?: boolean;
    children?: ReactNode;
    caseSensitive?: boolean;
  }
  
  export const Route: React.FC<RouteProps>;
  
  export interface NavigateProps {
    to: string;
    replace?: boolean;
    state?: any;
  }
  
  export const Navigate: React.FC<NavigateProps>;
  
  export const Routes: React.FC<{ children?: ReactNode }>;
  
  export function useNavigate(): (to: string, options?: { replace?: boolean, state?: any }) => void;
  export function useLocation(): H.Location;
  export function useParams<T = {}>(): T;
  
  export interface Location extends H.Location {
    state: any;
    key: string;
  }
}

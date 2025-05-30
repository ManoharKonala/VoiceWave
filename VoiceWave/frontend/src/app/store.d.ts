import { Store } from 'redux';
import { RootState } from '../types/store';

declare module 'app/store' {
  export const store: Store<RootState>;
}

declare module 'react-redux' {
  interface DefaultRootState extends RootState {}
}

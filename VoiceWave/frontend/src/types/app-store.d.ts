import { Store } from 'redux';
import { RootState } from '../app/store';

declare module 'app/store' {
  export const store: Store<RootState>;
}

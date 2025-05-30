import { Action, AnyAction, Store } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

// Define the root state type
export interface RootState {
  // Add your state slices here
  // Example:
  // user: UserState;
  // posts: PostsState;
}

// AppThunk type for thunks
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

// AppDispatch type for useDispatch hook
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

// Extend the default Dispatch type
declare module 'redux' {
  interface Dispatch<A extends Action = AnyAction> {
    <ReturnType = any, State = any, ExtraThunkArg = any>(
      thunkAction: ThunkAction<ReturnType, State, ExtraThunkArg, A>
    ): ReturnType;
  }
}

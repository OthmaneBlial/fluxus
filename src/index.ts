export type {
  Action,
  ActionCreator,
  Reducer,
  Middleware,
  IStore,
  StoreCreator,
  CreateStoreOptions
} from './types';

export { Store } from './core/store';
export { createAction } from './core/action';
export { createReducer } from './core/reducer';
export { applyMiddleware } from './core/middleware';

export { memoize } from './utils/memoize';
export { updateObject, updateArray } from './utils/immutable';
export { lazy, measureTime } from './utils/performance';

import { Store } from './core/store';
import { Reducer, Middleware } from './types';

/**
 * Creates and returns a new Fluxus store.
 * This is the main function users will interact with to set up their state management.
 * 
 * @template S The type of state held in the store
 * @param reducer The root reducer function
 * @param initialState The initial state of the application
 * @param middlewares An optional array of middleware functions
 * @returns A new Store instance
 */
export function createStore<S>(
  reducer: Reducer<S>,
  initialState: S,
  middlewares: Middleware[] = []
): Store<S> {
  return new Store(reducer, initialState, middlewares);
}
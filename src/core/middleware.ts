import { Store } from './store';
import { Action } from './action';

/**
 * Middleware is a higher-order function that composes a dispatch function to enable
 * features like dispatching async actions, routing, etc.
 */
export type Middleware = <S>(
  store: Store<S>
) => (next: (action: Action) => void) => (action: Action) => void;

/**
 * Applies middleware to the dispatch function of the store.
 * 
 * @param middlewares An array of middleware functions.
 * @param store The store instance.
 * @returns A new dispatch function enhanced with the middlewares.
 */
export function applyMiddleware<S>(
  middlewares: Middleware[],
  store: Store<S>
): (action: Action) => void {
  const chain = middlewares.map(middleware => middleware(store));
  
  return chain.reduceRight(
    (next, middleware) => middleware(next),
    store.dispatch.bind(store)
  );
}
import type { Action, IStore, Middleware, MiddlewareAPI } from '../types';

export type { Middleware } from '../types';

/** Compose middleware from left to right around a store's current dispatch. */
export function applyMiddleware<S>(middlewares: Middleware<S>[], store: IStore<S>): (action: Action) => void {
  const api: MiddlewareAPI<S> = {
    getState: () => store.getState(),
    dispatch: (action) => store.dispatch(action),
  };

  return middlewares.reduceRight(
    (next, middleware) => middleware(api)(next),
    store.dispatch.bind(store),
  );
}

import type { Action, Dispatch, IStore, Middleware, MiddlewareAPI } from '../types';

export type { Middleware } from '../types';

/** Compose middleware from left to right around a store's current dispatch. */
export function applyMiddleware<S, A extends Action = Action>(
  middlewares: Middleware<S, A>[], store: IStore<S, A>
): Dispatch<A> {
  const api: MiddlewareAPI<S, A> = {
    getState: () => store.getState(),
    dispatch: (action) => store.dispatch(action),
  };

  return middlewares.reduceRight(
    (next, middleware) => middleware(api)(next),
    store.dispatch.bind(store),
  );
}
